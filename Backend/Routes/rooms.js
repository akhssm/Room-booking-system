// Backend/Routes/rooms.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the connection pool

// GET all rooms
router.get('/', async (req, res) => {
  try {
    // pool.query returns an array: [rows, fields]
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rooms from database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST a new room
router.post('/', async (req, res) => {
  const { name, capacity, date, startTime, endTime, time, location, createdBy } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO rooms (name, capacity, date, startTime, endTime, time, location, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, capacity, date, startTime, endTime, time, location, createdBy]
    );
    // Assuming 'id' is auto-incremented, return the newly created room with its ID
    res.status(201).json({ id: result.insertId, name, capacity, date, startTime, endTime, time, location, createdBy });
  } catch (error) {
    console.error('Error creating room in database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PUT (update) a room
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, capacity, date, startTime, endTime, time, location, createdBy } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE rooms SET name = ?, capacity = ?, date = ?, startTime = ?, endTime = ?, time = ?, location = ?, createdBy = ? WHERE id = ?',
      [name, capacity, date, startTime, endTime, time, location, createdBy, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ id, name, capacity, date, startTime, endTime, time, location, createdBy }); // Return updated room
  } catch (error) {
    console.error('Error updating room in database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// DELETE a room
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting room from database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;