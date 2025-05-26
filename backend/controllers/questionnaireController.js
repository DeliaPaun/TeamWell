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
        JOIN questions q 
          ON q.id = r.question_id
        WHERE r.user_id = $1
          AND r.questionnaire_id = $2
          AND r.answer_value ~ '^[0-9]+$'
          AND q.scale_type = 'scale_1_5'`,
      [userId, questionnaireId]
    );
    const totalScore = scoreRes.rows[0].total || 0;

    let riskLevel = 'low';
    if (totalScore >= 80)      riskLevel = 'high';
    else if (totalScore >= 50) riskLevel = 'medium';

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

    await pool.query(
      `INSERT INTO burnout_scores
         (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())`,
      [userId, teamId, questionnaireId, totalScore, riskLevel]
    );

    res.json({ message: 'Răspunsuri și scor de burnout salvate.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitResponses };
