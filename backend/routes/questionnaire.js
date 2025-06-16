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

router.post('/:id/submit', submitResponses);

router.get('/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id                                AS user_id,
        u.first_name || ' ' || u.last_name AS name,
        json_agg(
          json_build_object(
            'questionnaire', q.title,
            'score',         s.score,
            'risk_level',    s.risk_level,
            'performance_level', s.performance_level,
            'date',          to_char(s.date, 'YYYY-MM-DD')
          )
          ORDER BY s.date DESC
        ) AS results
      FROM users u

      LEFT JOIN (
        SELECT user_id, questionnaire_id, score, risk_level, NULL::text AS performance_level, date
        FROM burnout_scores
        UNION ALL
        SELECT user_id, questionnaire_id, score, NULL::text AS risk_level, performance_level, date
        FROM performance_scores
      ) AS s
        ON s.user_id = u.id

      LEFT JOIN questionnaires q
        ON q.id = s.questionnaire_id

      GROUP BY u.id, name
      ORDER BY u.last_name, u.first_name;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea rezultatelor:', err);
    res.status(500).json({ error: 'Eroare la obținerea rezultatelor' });
  }
});

module.exports = router;
