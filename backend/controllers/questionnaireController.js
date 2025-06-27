const pool = require('../db');

async function submitResponses(req, res, next) {
  const questionnaireId = +req.params.id;
  const { userId, responses } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const check = await client.query(
      `SELECT 1 FROM responses
         WHERE user_id = $1
           AND questionnaire_id = $2
           AND DATE(answered_at) = CURRENT_DATE
         LIMIT 1`,
      [userId, questionnaireId]
    );

    if (check.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Chestionarul a fost deja completat astăzi.' });
    }

    for (const r of responses) {
      const isText = typeof r.answer === 'string' && isNaN(r.answer);
      const answerValue = isText ? null : Number(r.answer);
      const answerText  = isText ? r.answer : null;
      await client.query(
        `INSERT INTO responses
           (user_id, questionnaire_id, question_id, answer_value, answer_text, answered_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userId, questionnaireId, r.questionId, answerValue, answerText]
      );
    }

    const scoreRes = await client.query(
      `SELECT SUM(r.answer_value::float) AS total
         FROM responses r
         JOIN questions q ON q.id = r.question_id
        WHERE r.user_id = $1
          AND r.questionnaire_id = $2
          AND DATE(r.answered_at) = CURRENT_DATE
          AND q.scale_type IN ('scale_1_5', 'choice')`,
      [userId, questionnaireId]
    );
    const totalScore = Number(scoreRes.rows[0].total) || 0;

    const qcRes = await client.query(
      `SELECT COUNT(*) AS cnt
         FROM questions
        WHERE questionnaire_id = $1
          AND scale_type IN ('scale_1_5', 'choice')`,
      [questionnaireId]
    );
    const questionCount = parseInt(qcRes.rows[0].cnt, 10);
    const maxScore = questionCount * 5;

    const pct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const riskPct = 100 - pct;

    const tmRes = await client.query(
      `SELECT team_id
         FROM team_member
        WHERE user_id = $1
        ORDER BY joined_at DESC
        LIMIT 1`,
      [userId]
    );
    const teamId = tmRes.rows[0]?.team_id || null;

    const typeRes = await client.query(
      `SELECT title FROM questionnaires WHERE id = $1`,
      [questionnaireId]
    );
    const title = typeRes.rows[0]?.title || '';

    if (title.toLowerCase().includes('burnout')) {
      let riskLevel = 'low';
      if (riskPct >= 80)      riskLevel = 'high';
      else if (riskPct >= 50) riskLevel = 'medium';

      const bsRes = await client.query(
        `INSERT INTO burnout_scores
           (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
         VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())
         RETURNING id`,
        [userId, teamId, questionnaireId, riskPct, riskLevel]
      );
      const burnoutId = bsRes.rows[0].id;

      if ((riskLevel === 'medium' || riskLevel === 'high') && teamId) {
        const alertLevel = riskLevel === 'high' ? 'critical' : 'warning';
        const message = riskLevel === 'high'
          ? `Scor burnout critic: ${riskPct.toFixed(1)}%`
          : `Scor burnout mediu: ${riskPct.toFixed(1)}%`;

        await client.query(
          `INSERT INTO alerts
             (user_id, team_id, source_type, burnout_id, activity_id, alert_level, message)
           VALUES ($1, $2, 'burnout', $3, NULL, $4, $5)`,
          [userId, teamId, burnoutId, alertLevel, message]
        );
      }

    } else if (title.toLowerCase().includes('performan')) {
      let performanceLevel = 'low';
      if (pct >= 80)      performanceLevel = 'high';
      else if (pct >= 50) performanceLevel = 'medium';

      const psRes = await client.query(
        `INSERT INTO performance_scores
           (user_id, team_id, questionnaire_id, date, score, performance_level, created_at)
         VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())
         RETURNING id`,
        [userId, teamId, questionnaireId, pct, performanceLevel]
      );
      const performanceId = psRes.rows[0].id;

      if ((performanceLevel === 'low' || performanceLevel === 'medium') && teamId) {
        const alertLevel = performanceLevel === 'low' ? 'warning' : 'info';
        const message = performanceLevel === 'low'
          ? `Nivel scăzut de performanță: ${pct.toFixed(1)}%`
          : `Nivel mediu de performanță: ${pct.toFixed(1)}%`;

        await client.query(
          `INSERT INTO alerts
            (user_id, team_id, source_type, performance_id, alert_level, message)
          VALUES ($1, $2, 'performance', $3, $4, $5)`,
          [userId, teamId, performanceId, alertLevel, message]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Răspunsuri salvate cu succes și scor calculat.' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('submitResponses error:', err);
    next(err);

  } finally {
    client.release();
  }
}

module.exports = { submitResponses };
