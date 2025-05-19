const pool = require('../db');

exports.calculateAndStoreScore = async (userId, teamId, questionnaireId, date) => {
  // Exemplu simplu: media valorilor
  const res = await pool.query(
    `SELECT AVG(answer_value)::numeric(5,2) AS avg_score
     FROM responses r
     JOIN questions q ON r.question_id = q.id
     WHERE r.user_id = $1 AND q.questionnaire_id = $2`,
    [userId, questionnaireId]
  );
  const score = parseFloat(res.rows[0].avg_score) || 0;
  let risk = 'low';
  if (score > 3) risk = 'medium';
  if (score > 4) risk = 'high';

  await pool.query(
    `INSERT INTO burnout_scores (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [userId, teamId, questionnaireId, date, score, risk]
  );
  return { score, risk };
};

exports.getScoresForDashboard = async () => {
  const res = await pool.query(
    `SELECT date, AVG(score) AS avg_score
     FROM burnout_scores
     GROUP BY date
     ORDER BY date`
  );
  return res.rows;
};