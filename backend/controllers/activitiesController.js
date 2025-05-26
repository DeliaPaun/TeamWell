const pool = require('../db');

async function createActivity(req, res, next) {
  try {
    const { userId, date, tasksCompleted, hoursWorked } = req.body;

    if (tasksCompleted < 0 || hoursWorked < 0 || hoursWorked > 24) {
      return res.status(400).json({ error: 'Valori invalide pentru activitate.' });
    }

    await pool.query(
      `INSERT INTO activities (user_id, date, tasks_completed, hours_worked)
       VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4)`,
      [userId, date, tasksCompleted, hoursWorked]
    );

    res.status(201).json({ message: 'Activity successfully logged.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createActivity };
