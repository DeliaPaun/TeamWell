const pool = require('../db');

exports.logActivities = async (userId, metrics) => {
  const queries = metrics.map(({ date, tasks_completed, hours_worked }) => {
    return pool.query(
      `INSERT INTO activities (user_id, date, tasks_completed, hours_worked)
       VALUES ($1, $2, $3, $4)`,
      [userId, date, tasks_completed, hours_worked]
    );
  });
  await Promise.all(queries);
};