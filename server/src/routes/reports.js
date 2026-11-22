const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { getRanges } = require('../utils/reportRanges');

const router = express.Router();
router.use(auth);

async function getStats(userId, from, to) {
  const result = await pool.query(
    `SELECT MAX(value) AS highest, MIN(value) AS lowest,
            ROUND(AVG(value), 1) AS average, COUNT(*) AS count
     FROM readings
     WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
    [userId, from, to]
  );
  const row = result.rows[0];
  const count = Number(row.count);

  if (count === 0) {
    return { from, to, count: 0, highest: null, lowest: null, average: null };
  }
  return {
    from,
    to,
    count,
    highest: row.highest,
    lowest: row.lowest,
    average: Number(row.average),
  };
}

// GET /api/reports?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const date = req.query.date || new Date().toLocaleDateString('en-CA');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date))) {
    return res.status(400).json({ error: 'Please enter a valid date.' });
  }

  try {
    const ranges = getRanges(date);

    const [daily, monthToDate, monthly, list] = await Promise.all([
      getStats(req.userId, ranges.daily.from, ranges.daily.to),
      getStats(req.userId, ranges.monthToDate.from, ranges.monthToDate.to),
      getStats(req.userId, ranges.monthly.from, ranges.monthly.to),
      pool.query(
        `SELECT id, slot, value FROM readings
         WHERE user_id = $1 AND reading_date = $2
         ORDER BY CASE slot
           WHEN 'morning' THEN 1
           WHEN 'after_breakfast' THEN 2
           WHEN 'after_lunch' THEN 3
           WHEN 'after_dinner' THEN 4
         END`,
        [req.userId, date]
      ),
    ]);

    res.json({
      date,
      daily: { ...daily, readings: list.rows },
      monthToDate,
      monthly,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;