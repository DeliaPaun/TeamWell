const pool = require('./db');

async function seedPerformanceQuestions() {
  try {
    await pool.query(`
      INSERT INTO questionnaires (title, version, created_at)
      VALUES ('Chestionar Performanță', '1.0', NOW())
    `);

    const result = await pool.query(
      `SELECT id FROM questionnaires WHERE title = 'Chestionar Performanță'`
    );
    const questionnaireId = result.rows[0].id;

    const questions = [
      { text: 'Cât de clare îți sunt obiectivele de performanță la locul de muncă?', scale_type: 'scale_1_5' },
      { text: 'Primești feedback constructiv de la superiori în mod regulat?', scale_type: 'choice' },
      { text: 'Ai resursele necesare pentru a-ți îndeplini sarcinile la nivel optim?', scale_type: 'choice' },
      { text: 'În ce măsură te simți recunoscut(ă) pentru realizările tale?', scale_type: 'scale_1_5' },
      { text: 'Cum apreciezi sprijinul pe care îl primești din partea echipei?', scale_type: 'scale_1_5' },
      { text: 'Ai oportunități de a-ți dezvolta competențele profesionale?', scale_type: 'choice' },
      { text: 'Cât de bine comunică echipa obiectivele și schimbările?', scale_type: 'scale_1_5' },
      { text: 'Te simți motivat(ă) să îți îndeplinești sarcinile?', scale_type: 'choice' },
      { text: 'Care sunt sugestiile tale pentru îmbunătățirea proceselor de muncă?', scale_type: 'text' },
      { text: 'Ai propuneri pentru creșterea eficienței în echipă?', scale_type: 'text' }
    ];

    for (let q of questions) {
      await pool.query(
        `INSERT INTO questions (questionnaire_id, text, scale_type)
         VALUES ($1, $2, $3)`,
        [questionnaireId, q.text, q.scale_type]
      );
    }

    console.log('✅ Întrebările chestionarului de performanță au fost adăugate cu succes!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Eroare la seedPerformanceQuestions:', err);
    process.exit(1);
  }
}

seedPerformanceQuestions();
