require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

const DEMO = {
  name: 'Demo User',
  email: 'demo@sweety.com',
  password: 'demo1234',
};

const SLOTS = ['morning', 'after_breakfast', 'after_lunch', 'after_dinner'];

// Typical values per slot, with a bit of random variation
const BASE = { morning: 100, after_breakfast: 150, after_lunch: 145, after_dinner: 140 };

function formatDate(d) {
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

async function seed() {
  try {
    // Re-running the script gives a fresh demo user
    await pool.query('DELETE FROM users WHERE email = $1', [DEMO.email]);

    const hash = await bcrypt.hash(DEMO.password, 10);
    const userResult = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [DEMO.name, DEMO.email, hash]
    );
    const userId = userResult.rows[0].id;

    let inserted = 0;
    const today = new Date();

    // Last 60 days, so both month-to-date and previous-month reports have data
    for (let i = 0; i < 60; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dateStr = formatDate(day);

      // Vary how many readings each day has (2 to 4), so reports look realistic
      const howMany = 2 + Math.floor(Math.random() * 3);
      const slotsForDay = SLOTS.slice(0, howMany);

      for (const slot of slotsForDay) {
        const value = BASE[slot] + Math.floor(Math.random() * 41) - 20; // +/- 20
        await pool.query(
          'INSERT INTO readings (user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4)',
          [userId, dateStr, slot, value]
        );
        inserted++;
      }
    }

    console.log(`Seeded demo user and ${inserted} readings.`);
    console.log(`Login with: ${DEMO.email} / ${DEMO.password}`);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();