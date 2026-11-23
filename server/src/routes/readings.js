const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { SLOTS, validateReading ,withArticle} = require('../utils/validateReading');
const { parsePagination } = require('../utils/pagination');

const router = express.Router();
router.use(auth); // sab routes login ke baad hi

// Add a reading
router.post('/', async (req, res) => {
  const { date, slot, value } = req.body;

  const error = validateReading({ date, slot, value });
  if (error) return res.status(400).json({ error });

  try {
    const dup = await pool.query(
      'SELECT id FROM readings WHERE user_id = $1 AND reading_date = $2 AND slot = $3',
      [req.userId, date, slot]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({ error: `You already have ${withArticle(SLOTS[slot])} reading for this date.`});
    }

    const count = await pool.query(
      'SELECT COUNT(*) FROM readings WHERE user_id = $1 AND reading_date = $2',
      [req.userId, date]
    );
    if (Number(count.rows[0].count) >= 4) {
      return res.status(409).json({ error: 'You can add only 4 readings per day.' });
    }

    const result = await pool.query(
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, $2, $3, $4)
       RETURNING id, to_char(reading_date, 'YYYY-MM-DD') AS date, slot, value`,
      [req.userId, date, slot, Number(value)]
    );
    res.status(201).json({ reading: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// List my readings (optional ?date=YYYY-MM-DD)
router.get('/', async (req, res) => {
   const { date } = req.query;
  const { page, limit, offset } = parsePagination(req.query);

  try {
    const params = [req.userId];
    let where = 'user_id = $1';
    if (date) {
      params.push(date);
      where += ' AND reading_date = $2';
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM readings WHERE ${where}`,
      params
    );
    const total = Number(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT id, to_char(reading_date, 'YYYY-MM-DD') AS date, slot, value
       FROM readings WHERE ${where}
       ORDER BY reading_date DESC, id
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      readings: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


// Edit a reading
router.put('/:id', async (req, res) => {
  const { date, slot, value } = req.body;

  const error = validateReading({ date, slot, value });
  if (error) return res.status(400).json({ error });

  try {
    const dup = await pool.query(
      `SELECT id FROM readings
       WHERE user_id = $1 AND reading_date = $2 AND slot = $3 AND id <> $4`,
      [req.userId, date, slot, req.params.id]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({ error: `You already have ${withArticle(SLOTS[slot])} reading for this date.`});
    }

    const result = await pool.query(
      `UPDATE readings SET reading_date = $1, slot = $2, value = $3
       WHERE id = $4 AND user_id = $5
       RETURNING id, to_char(reading_date, 'YYYY-MM-DD') AS date, slot, value`,
      [date, slot, Number(value), req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reading not found.' });
    }
    res.json({ reading: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Delete a reading
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM readings WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reading not found.' });
    }
    res.json({ message: 'Reading deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;