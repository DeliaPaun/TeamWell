const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const requireAuth = require('../middlewares/auth');

router.get('/results', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        r.user_id,
        u.first_name,
        u.last_name,
        qn.title           AS questionnaire,
        ROUND(AVG(r.answer_value::numeric),2) AS avg_score,
        MAX(r.answered_at)::date             AS last_date
      FROM responses r
      JOIN questions q ON q.id = r.question_id
      JOIN questionnaires qn ON qn.id = q.questionnaire_id
      JOIN users u ON u.id = r.user_id
      GROUP BY r.user_id, u.first_name, u.last_name, qn.title
      ORDER BY u.last_name, last_date DESC
    `);

    const byUser = rows.reduce((acc, row) => {
      const key = row.user_id;
      if (!acc[key]) {
        acc[key] = {
          user_id: key,
          name: `${row.first_name} ${row.last_name}`,
          results: []
        };
      }
      acc[key].results.push({
        questionnaire: row.questionnaire,
        score: row.avg_score,
        date: row.last_date
      });
      return acc;
    }, {});

    res.json(Object.values(byUser));
  } catch (err) {
    console.error('Eroare:', err);
    res.status(500).json({ message: 'Eroare la preluarea rezultatelor.' });
  }
});

module.exports = router;
