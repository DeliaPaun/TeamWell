const pool = require('./db');

async function seedActivities() {
  try {
    const activities = [
      { user_id: 1, date: '2025-05-01', tasks_completed:  5, hours_worked:  8 },
      { user_id: 1, date: '2025-05-02', tasks_completed:  7, hours_worked:  9 },
      { user_id: 2, date: '2025-05-01', tasks_completed: 10, hours_worked:  7 },
      { user_id: 2, date: '2025-05-02', tasks_completed:  4, hours_worked: 11 },
      { user_id: 3, date: '2025-05-01', tasks_completed:  6, hours_worked:  8 },
      { user_id: 3, date: '2025-05-02', tasks_completed:  8, hours_worked: 10 },
    ];

    await pool.query(`TRUNCATE activities RESTART IDENTITY CASCADE;`);

    for (let a of activities) {
      await pool.query(
        `INSERT INTO activities
           (user_id, date, tasks_completed, hours_worked)
         VALUES
           ($1,      $2,   $3,              $4)`,
        [a.user_id, a.date, a.tasks_completed, a.hours_worked]
      );
    }

    console.log('✅ Înregistrările pentru activities au fost adăugate cu succes!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Eroare la seedActivities:', err);
    process.exit(1);
  }
}

seedActivities();
