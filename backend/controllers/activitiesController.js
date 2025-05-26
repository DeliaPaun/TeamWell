const pool = require('../db');

async function createActivity(req, res, next) {
  try {
    const { userId, date, tasksCompleted, hoursWorked } = req.body;

    if (tasksCompleted < 0 || hoursWorked < 0 || hoursWorked > 24) {
      return res.status(400).json({ error: 'Valori invalide pentru activitate.' });
    }

    const actRes = await pool.query(
      `INSERT INTO activities (user_id, date, tasks_completed, hours_worked)
       VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4)
       RETURNING id, date`,
      [userId, date, tasksCompleted, hoursWorked]
    );
    const activityId = actRes.rows[0].id;
    const usedDate    = actRes.rows[0].date;
    
    const tmRes = await pool.query(
      `SELECT team_id
         FROM team_member
        WHERE user_id = $1
        ORDER BY joined_at DESC
        LIMIT 1`,
      [userId, usedDate]
    );
    const teamId = tmRes.rows[0]?.team_id || null;

    if (tasksCompleted === 0 && teamId) {
      await pool.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, burnout_id, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', NULL, $3, 'info', $4, 'Nicio sarcină finalizată astăzi.')`,
        [userId, teamId, activityId]
      );
    }

    if (hoursWorked < 2 && teamId) {
      await pool.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, burnout_id, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', NULL, $3, 'warning', $4)`,
        [userId, teamId, activityId, `Număr redus de ore lucrate: ${hoursWorked}`]
      );
    }

    res.status(201).json({ message: 'Activity successfully logged.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createActivity };
