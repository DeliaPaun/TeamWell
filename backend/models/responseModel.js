const pool = require('../db');

exports.saveResponses = async (userId, answers) => {
  const queries = answers.map(({ question_id, answer_value }) => {
    return pool.query(
      `INSERT INTO responses (user_id, question_id, answer_value, answered_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, question_id, answer_value]
    );
  });
  await Promise.all(queries);
};