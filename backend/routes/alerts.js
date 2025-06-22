const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, user_id, team_id, source_type, alert_level, message, created_at
      FROM alerts
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
