const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.get('/:id/team', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(`
      SELECT 
        t.id, 
        t.name, 
        t.description
      FROM team_member tm
      JOIN team t ON t.id = tm.team_id
      WHERE tm.user_id = $1
      ORDER BY tm.joined_at DESC
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nu ești afiliat niciunei echipe.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Eroare la obținerea echipei:', err);
    res.status(500).json({ error: 'Eroare internă la obținerea echipei' });
  }
});

module.exports = router;
