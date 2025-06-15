const pool = require('./db');

async function seedBurnoutQuestions() {
  try {

    await pool.query(`DELETE FROM questionnaires WHERE title = 'Chestionar Burnout'`);

    const result = await pool.query(`
      INSERT INTO questionnaires (title, version, created_at)
      VALUES ('Chestionar Burnout', '1.0', NOW())
      RETURNING id
    `);

    const questionnaireId = result.rows[0].id;

    const questions = [
      { text: 'Cât de obosit te-ai simțit în această săptămână?', scale_type: 'scale_1_5' },
      { text: 'Ai simțit anxietate în timpul programului?', scale_type: 'choice' },
      { text: 'Ce factori contribuie cel mai mult la stresul tău?', scale_type: 'text' },
      { text: 'Cât de bine te-ai putut concentra asupra sarcinilor?', scale_type: 'scale_1_5' },
      { text: 'Ai avut dificultăți în a te deconecta după program?', scale_type: 'choice' },
      { text: 'Cum apreciezi calitatea pauzelor tale?', scale_type: 'scale_1_5' },
      { text: 'Ai simțit lipsa de sprijin din partea echipei?', scale_type: 'choice' },
      { text: 'Ce te-ar ajuta să îți îmbunătățești starea la muncă?', scale_type: 'text' },
      { text: 'Te-ai simțit inutil sau lipsit de valoare la muncă?', scale_type: 'choice' },
      { text: 'Cât de satisfăcut ești de echilibrul muncă-viață?', scale_type: 'scale_1_5' },
      { text: 'Ai avut gânduri de a renunța la job în ultima lună?', scale_type: 'choice' },
      { text: 'Ce ai schimba în cultura organizațională?', scale_type: 'text' },
      { text: 'Cât de stresat te-ai simțit în general săptămâna aceasta?', scale_type: 'scale_1_5' }
    ];

    for (let q of questions) {
      await pool.query(
        `INSERT INTO questions (questionnaire_id, text, scale_type)
         VALUES ($1, $2, $3)`,
        [questionnaireId, q.text, q.scale_type]
      );
    }

    console.log('✅ Întrebările de burnout au fost adăugate cu succes!');
    process.exit();
  } catch (err) {
    console.error('❌ Eroare la seedBurnoutQuestions:', err);
    process.exit(1);
  }
}

seedBurnoutQuestions();
