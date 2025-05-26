const pool = require('../db');

async function submitResponses(req, res, next) {
  const questionnaireId = +req.params.id;
  const { userId, responses } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const r of responses) {
      await client.query(
        `INSERT INTO responses
           (user_id, questionnaire_id, question_id, answer_value, answered_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, questionnaireId, r.questionId, r.answer]
      );
    }

    const scoreRes = await client.query(
      `SELECT SUM(r.answer_value::integer) AS total
         FROM responses r
         JOIN questions q ON q.id = r.question_id
        WHERE r.user_id = $1
          AND r.questionnaire_id = $2
          AND q.scale_type = 'scale_1_5'`,
      [userId, questionnaireId]
    );
    const totalScore = Number(scoreRes.rows[0].total) || 0;

    const qcRes = await client.query(
      `SELECT COUNT(*) AS cnt
         FROM questions
        WHERE questionnaire_id = $1`,
      [questionnaireId]
    );
    const questionCount = parseInt(qcRes.rows[0].cnt, 10);

    const maxScore = questionCount * 5;
    const pct      = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    let riskLevel = 'low';
    if (pct >= 80)      riskLevel = 'high';
    else if (pct >= 50) riskLevel = 'medium';

    const tmRes = await client.query(
      `SELECT team_id
         FROM team_member
        WHERE user_id = $1
        ORDER BY joined_at DESC
        LIMIT 1`,
      [userId]
    );
    const teamId = tmRes.rows[0]?.team_id || null;

    const bsRes = await client.query(
      `INSERT INTO burnout_scores
         (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())
       RETURNING id`,
      [userId, teamId, questionnaireId, totalScore, riskLevel]
    );
    const burnoutId = bsRes.rows[0].id;

    if ((riskLevel === 'medium' || riskLevel === 'high') && teamId) {
      const alertLevel = riskLevel === 'high' ? 'critical' : 'warning';
      const message =
        riskLevel === 'high'
          ? `Scorul de burnout critic: ${totalScore} (${pct.toFixed(1)}%)`
          : `Scor ridicat de burnout: ${totalScore} (${pct.toFixed(1)}%)`;

      await client.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, burnout_id, activity_id, alert_level, message)
         VALUES ($1, $2, 'burnout', $3, NULL, $4, $5)`,
        [userId, teamId, burnoutId, alertLevel, message]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Răspunsuri și scor de burnout salvate cu succes.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('submitResponses error:', err);
    next(err);
  } finally {
    client.release();
  }
}

module.exports = { submitResponses };
