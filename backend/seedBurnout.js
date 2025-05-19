const pool = require('./db');

async function seedQuestions() {
  try {
    await pool.query(`
      INSERT INTO questionnaires (title, version, created_at)
      VALUES ('Burnout Assessment', '1.0', NOW())
    `);

    const result = await pool.query(`SELECT id FROM questionnaires WHERE title = 'Burnout Assessment'`);
    const questionnaireId = result.rows[0].id;

    const questions = [
      { text: 'Cât de obosit te-ai simțit în această săptămână?', scale_type: 'scale_1_5' },
      { text: 'Care sunt principalele cauze ale stresului tău?', scale_type: 'text' },
      { text: 'Simți că ai sprijinul echipei?', scale_type: 'choice' },
      { text: 'Ai reușit să îți îndeplinești sarcinile la timp?', scale_type: 'choice' },
      { text: 'Cât de satisfăcut ești de echilibrul muncă-viață?', scale_type: 'scale_1_5' },
      { text: 'Ce ai schimba în mediul tău de lucru?', scale_type: 'text' },
      { text: 'Ai simțit anxietate în timpul programului de lucru?', scale_type: 'choice' },
      { text: 'Cum apreciezi calitatea pauzelor tale?', scale_type: 'scale_1_5' },
      { text: 'Ai oportunități clare de dezvoltare profesională?', scale_type: 'choice' },
      { text: 'Vrei să adaugi alt feedback legat de starea ta?', scale_type: 'text' }
    ];

    for (let q of questions) {
      await pool.query(
        `INSERT INTO questions (questionnaire_id, text, scale_type)
         VALUES ($1, $2, $3)`,
        [questionnaireId, q.text, q.scale_type]
      );
    }

    console.log('✅ Întrebările au fost adăugate cu succes!');
    process.exit();
  } catch (err) {
    console.error('❌ Eroare la seedQuestions:', err);
    process.exit(1);
  }
}

seedQuestions();
