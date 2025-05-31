// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// // --- CORRECTED LINE ---
// // Import only the pool, as db.js exports it directly
// const pool = require('./db'); // No destructuring needed here

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // --- REMOVE THIS LINE ---
// // The connection test already runs when 'require('./db')' is executed
// // connectToDatabase(); // <<< REMOVE THIS LINE

// // Import Routes
// const roomRoutes = require('./Routes/rooms');
// const bookingRoutes = require('./Routes/bookings');

// // Use Routes
// app.use('/api/rooms', roomRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Basic route
// app.get('/', (req, res) => {
//   res.send('Room Booking App Backend');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });





















// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // body-parser is often included in express nowadays, but keeping it for clarity
const dotenv = require('dotenv');

// Import your database connection pool
// Assuming db.js exports the pool directly, as per your comment
const pool = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing for frontend requests
app.use(bodyParser.json()); // Parses incoming JSON requests

// --- Import Authentication Routes ---
// Assuming your authentication router file is named 'authRoutes.js'
// and is located in the './Routes' directory, similar to rooms and bookings.
const authRoutes = require('./Routes/auth'); // Adjust path if different

// Import other Routes
const roomRoutes = require('./Routes/rooms');
const bookingRoutes = require('./Routes/bookings');

// --- Use Routes ---
// Mount the authentication routes under the /api/auth path
app.use('/api/auth', authRoutes); // This is the crucial addition!

// Use other routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic root route for testing if the server is up
app.get('/', (req, res) => {
  res.send('Room Booking App Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Note: The 'connectToDatabase()' line was removed as per your comment,
// as the connection typically happens when 'require('./db')' is executed.