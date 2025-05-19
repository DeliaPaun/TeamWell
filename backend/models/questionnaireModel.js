const pool = require('../db');

exports.getAllQuestionnaires = async () => {
  const res = await pool.query('SELECT id, title, version, created_at FROM questionnaires');
  return res.rows;
};

exports.getQuestionsByQuestionnaire = async questionnaireId => {
  const res = await pool.query(
    `SELECT id, text, scale_type FROM questions WHERE questionnaire_id = $1 ORDER BY id`,
    [questionnaireId]
  );
  return res.rows;
};