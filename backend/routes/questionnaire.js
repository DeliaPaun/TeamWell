const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id                                  AS user_id,
        u.first_name || ' ' || u.last_name   AS name,
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

// Obține toate chestionarele
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM questionnaires');
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea chestionarelor:', err);
    res.status(500).json({ error: 'Eroare la obținerea chestionarelor' });
  }
});

// Obține întrebările pentru un chestionar specific
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

// Trimite răspunsurile la chestionar
router.post('/submit', async (req, res) => {
  const { userId, questionnaireId, responses } = req.body;

  if (!userId || !questionnaireId || !Array.isArray(responses)) {
    return res.status(400).json({ error: 'Lipsește userId, questionnaireId sau responses' });
  }

  try {
    // 1) Salvează fiecare răspuns
    await Promise.all(responses.map(r =>
      pool.query(
        `INSERT INTO responses
           (user_id, questionnaire_id, question_id, answer_value, answered_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, questionnaireId, r.questionId, r.answer]
      )
    ));

    // 2) Calculează scorul total de burnout
    const scoreRes = await pool.query(
      `SELECT 
        SUM(r.answer_value::integer) AS total
        FROM responses r
        JOIN questions q 
          ON q.id = r.question_id
        WHERE r.user_id = $1
          AND r.questionnaire_id = $2
          AND r.answer_value ~ '^[0-9]+$'
          AND q.scale_type = 'scale_1_5'`,
      [userId, questionnaireId]
    );
    const totalScore = Number(scoreRes.rows[0].total) || 0;

    // 3) Determină nivelul de risc
    let riskLevel = 'low';
    if (totalScore >= 80)      riskLevel = 'high';
    else if (totalScore >= 50) riskLevel = 'medium';

    // 4) Află echipa curentă a utilizatorului
    const tmRes = await pool.query(
      `SELECT team_id
         FROM team_member
        WHERE user_id = $1
          AND joined_at <= CURRENT_DATE
        ORDER BY joined_at DESC
        LIMIT 1`,
      [userId]
    );
    const teamId = tmRes.rows[0]?.team_id || null;

    // 5) Inserează în burnout_scores
    await pool.query(
      `INSERT INTO burnout_scores
         (user_id, team_id, questionnaire_id, date, score, risk_level, created_at)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW())`,
      [userId, teamId, questionnaireId, totalScore, riskLevel]
    );

    res.json({ message: 'Răspunsuri și scor de burnout salvate cu succes.' });
  } catch (err) {
    console.error('Eroare la procesarea răspunsurilor:', err);
    res.status(500).json({ error: 'Eroare la procesarea răspunsurilor' });
  }
});

module.exports = router;