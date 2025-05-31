// Backend/db.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Replace this!
  database: 'room_booking_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// This block runs immediately when 'db.js' is required
pool.getConnection()
  .then(connection => {
    console.log('🔗 Connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to MySQL pool:', err.message);
    process.exit(1);
  });

module.exports = pool; // ONLY export the pool