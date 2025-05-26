const pool = require('../db');

async function submitResponses(req, res, next) {
  const questionnaireId = req.params.id;
  const { userId, responses } = req.body;

  try {
    await Promise.all(responses.map(r =>
      pool.query(
        `INSERT INTO responses
           (user_id, questionnaire_id, question_id, answer_value, answered_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, questionnaireId, r.questionId, r.answer]
      )
    ));

    const scoreRes = await pool.query(
      `SELECT 
         SUM(r.answer_value::integer) AS total
       FROM responses r
       JOIN questions q ON q.id = r.question_id
       WHERE r.user_id = $1
         AND r.questionnaire_id = $2
         AND q.scale_type = 'scale_1_5'`,
      [userId, questionnaireId]
    );
    const totalScore = Number(scoreRes.rows[0].total) || 0;

    const questionCount = questions.length;
    const maxScore      = questionCount * 5;
    const pct           = (totalScore / maxScore) * 100;

    let riskLevel = 'low';
    if (pct >= 80)      riskLevel = 'high';
    else if (pct >= 50) riskLevel = 'medium';

    const tmRes = await pool.query(
      `SELECT team_id
         FROM team_member
        WHERE user_id = $1
          AND joined_at <= CURRENT_DATE
        ORDER BY joined_at DESC
        LIMIT 1`,
      [userId]
    );
    const teamId = tmRes.rows[0]?.team_id || null;

    const bsRes = await pool.query(
      `INSERT INTO burnout_scores
         (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())
       RETURNING id`,
      [userId, teamId, questionnaireId, totalScore, riskLevel]
    );
    const burnoutId = bsRes.rows[0].id;

    if (riskLevel === 'high' || riskLevel === 'medium') {
      const alertLevel = riskLevel === 'high' ? 'critical' : 'warning';
      const message = riskLevel === 'high'
        ? `Scorul de burnout al utilizatorului ${userId} este critic (${totalScore}).`
        : `Scorul de burnout al utilizatorului ${userId} este ridicat (${totalScore}).`;

      await pool.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, burnout_id, activity_id, alert_level, message)
         VALUES ($1, $2, 'burnout', $3, NULL, $4, $5)`,
        [userId, teamId, burnoutId, alertLevel, message]
      );
    }

    res.json({ message: 'Răspunsuri și scor de burnout salvate.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitResponses };
