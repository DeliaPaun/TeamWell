const pool = require('../db');

async function evaluateActivity(userId, activityId, date) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT tasks_completed, hours_worked
         FROM activities
        WHERE id = $1 AND user_id = $2`,
      [activityId, userId]
    );
    if (res.rowCount === 0) return;

    const { tasks_completed, hours_worked } = res.rows[0];
    const productivity = hours_worked > 0 ? tasks_completed / hours_worked : 0;

    const teamRes = await client.query(
      `SELECT team_id FROM team_member
        WHERE user_id = $1 ORDER BY joined_at DESC LIMIT 1`,
      [userId]
    );
    const teamId = teamRes.rows[0]?.team_id || null;
    if (!teamId) return;

    if (tasks_completed === 0) {
      await client.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', $3, 'info', 'Nicio sarcină finalizată astăzi.')`,
        [userId, teamId, activityId]
      );
    }

    if (hours_worked < 2) {
      await client.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', $3, 'warning', $4)`,
        [userId, teamId, activityId, `Număr redus de ore lucrate: ${hours_worked}`]
      );
    }

    if (hours_worked > 12) {
      await client.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', $3, 'warning', $4)`,
        [userId, teamId, activityId, `Număr excesiv de ore lucrate: ${hours_worked}`]
      );
    }

    if (productivity < 0.5) {
      await client.query(
        `INSERT INTO alerts
           (user_id, team_id, source_type, activity_id, alert_level, message)
         VALUES ($1, $2, 'activity', $3, 'warning', $4)`,
        [userId, teamId, activityId, `Productivitate scăzută: ${productivity.toFixed(2)}`]
      );
    }

  } catch (err) {
    console.error('evaluateActivity error:', err);
  } finally {
    client.release();
  }
}

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
    const usedDate   = actRes.rows[0].date;

    await evaluateActivity(userId, activityId, usedDate);

    res.status(201).json({ message: 'Activitate înregistrată cu succes.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createActivity };
