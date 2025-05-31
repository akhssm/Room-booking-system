// const express = require('express');
// const bcrypt = require('bcryptjs');
// const db = require('../db');

// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
//     db.query(sql, [email, hashedPassword, role], (err, result) => {
//       if (err) {
//         if (err.code === 'ER_DUP_ENTRY') {
//           return res.status(400).json({ message: 'User already exists' });
//         }
//         return res.status(500).json({ message: 'Database error', error: err });
//       }

//       res.status(201).json({ message: 'User registered successfully' });
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Login
// router.post('/login', (req, res) => {
//   const { email, password, role } = req.body;

//   const sql = 'SELECT * FROM users WHERE email = ? AND role = ?';
//   db.query(sql, [email, role], async (err, results) => {
//     if (err) return res.status(500).json({ message: 'DB error', error: err });

//     if (results.length === 0) {
//       return res.status(401).json({ message: 'Invalid email or role' });
//     }

//     const user = results[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (match) {
//       res.status(200).json({ message: 'Login successful', user: { email: user.email, role: user.role } });
//     } else {
//       res.status(401).json({ message: 'Incorrect password' });
//     }
//   });
// });

// module.exports = router;















const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db'); // Changed 'db' to 'pool' as db.js exports the pool directly

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Register request received:', { email, role }); // Debug log

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password generated.'); // Debug log

    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    // Using await with pool.query as mysql2/promise returns a Promise
    const [result] = await pool.query(sql, [email, hashedPassword, role]); // Destructure to get the result object
    console.log('User registered successfully:', email, result); // Debug log

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error during registration:', err); // Debug log
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => { // Made this function async to use await
  const { email, password, role } = req.body;
  console.log('Login request received:', { email, role }); // Debug log

  try {
    const sql = 'SELECT * FROM users WHERE email = ? AND role = ?';
    // Using await with pool.query
    const [results] = await pool.query(sql, [email, role]); // Destructure to get the results array
    console.log('DB query results:', results); // Debug log: See what the query returned

    if (results.length === 0) {
      console.log('Invalid email or role: User not found.'); // Debug log
      return res.status(401).json({ message: 'Invalid email or role' });
    }

    const user = results[0];
    console.log('User found:', { email: user.email, role: user.role }); // Debug log

    // Compare the provided password with the hashed password from the database
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match result:', match); // Debug log: true or false

    if (match) {
      console.log('Login successful for user:', email); // Debug log
      res.status(200).json({ message: 'Login successful', user: { email: user.email, role: user.role } });
    } else {
      console.log('Incorrect password for user:', email); // Debug log
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (err) {
    console.error('Error during login query or bcrypt comparison:', err); // Debug log
    res.status(500).json({ message: 'DB error or server error', error: err.message });
  }
});

module.exports = router;