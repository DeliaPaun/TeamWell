const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { submitResponses } = require('../controllers/questionnaireController');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM questionnaires');
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea chestionarelor:', err);
    res.status(500).json({ error: 'Eroare la obținerea chestionarelor' });
  }
});

router.get('/:id/questions', async (req, res) => {
  const questionnaireId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, text, scale_type FROM questions WHERE questionnaire_id = $1',
      [questionnaireId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea întrebărilor:', err);
    res.status(500).json({ error: 'Eroare la obținerea întrebărilor' });
  }
});

router.post('/submit', submitResponses);

router.get('/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id                                AS user_id,
        u.first_name || ' ' || u.last_name AS name,
        json_agg(
          json_build_object(
            'questionnaire', q.title,
            'score',         bs.score,
            'risk_level',    bs.risk_level,
            'date',          to_char(bs.date, 'YYYY-MM-DD')
          )
          ORDER BY bs.date DESC
        ) AS results
      FROM burnout_scores bs
      JOIN users u ON u.id = bs.user_id
      JOIN questionnaires q ON q.id = bs.questionnaire_id
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY u.last_name, u.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea rezultatelor:', err);
    res.status(500).json({ error: 'Eroare la obținerea rezultatelor' });
  }
});

module.exports = router;
