// Backend/Routes/bookings.js (example - adapt to your specific booking logic)

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the connection pool

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings from database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST a new booking
router.post('/', async (req, res) => {
  const { roomId, roomName, bookerName, bookerNumber, purpose, status, bookingTime, bookedBy, paymentMethod, paymentDetails } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO bookings (roomId, roomName, bookerName, bookerNumber, purpose, status, bookingTime, bookedBy, paymentMethod, paymentDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [roomId, roomName, bookerName, bookerNumber, purpose, status, bookingTime, bookedBy, paymentMethod, paymentDetails]
    );
    res.status(201).json({ id: result.insertId, roomId, roomName, bookerName, bookerNumber, purpose, status, bookingTime, bookedBy, paymentMethod, paymentDetails });
  } catch (error) {
    console.error('Error creating booking in database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking from database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PATCH confirm booking
router.patch('/:id/confirm', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE bookings SET status = "Confirmed" WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Fetch the updated booking to return it
    const [updatedBooking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json(updatedBooking[0]);
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;