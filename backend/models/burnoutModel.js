const pool = require('../db');

/**
 * @param {number} userId
 * @param {number|null} teamId
 * @param {number} questionnaireId
 * @param {string|Date} date         
 * @param {number} score
 * @param {'low'|'medium'|'high'} risk
 */
exports.storeScore = async (userId, teamId, questionnaireId, date, score, risk) => {
  await pool.query(
    `INSERT INTO burnout_scores
       (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [userId, teamId, questionnaireId, date, score, risk]
  );
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
