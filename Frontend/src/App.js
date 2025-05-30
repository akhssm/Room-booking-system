import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Rooms from './Pages/Rooms';
import SearchPage from './Pages/SearchPage';
import BookingForm from './Components/BookingForm';

function App() {
  // Sample rooms data - you can fetch or load this dynamically
  const [rooms] = useState([
    { id: 1, name: 'Conference Room A', time: '10:00 AM - 11:00 AM' },
    { id: 2, name: 'Meeting Room B', time: '2:00 PM - 3:00 PM' },
    // Add more rooms here
  ]);

  const [bookedRooms, setBookedRooms] = useState([]);
  const [user, setUser] = useState(null);

  const handleBookRoom = (newBooking) => {
    const bookingWithId = {
      ...newBooking,
      id: Date.now(),
      status: 'Pending',
    };
    setBookedRooms((prev) => [...prev, bookingWithId]);
  };

  // Protect routes: redirect to /login if not logged in
  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header user={user} setUser={setUser} />

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home userRole={user?.role} />
                </RequireAuth>
              }
            />
            <Route
              path="/rooms"
              element={
                <RequireAuth>
                  <Rooms bookedRooms={bookedRooms} user={user} rooms={rooms} />
                </RequireAuth>
              }
            />
            <Route
              path="/search"
              element={
                <RequireAuth>
                  <SearchPage onBook={handleBookRoom} rooms={rooms} />
                </RequireAuth>
              }
            />

            {/* Booking form page for a specific room */}
            <Route
              path="/book/:roomId"
              element={
                <RequireAuth>
                  <BookingForm rooms={rooms} onSubmit={handleBookRoom} user={user} />
                </RequireAuth>
              }
            />

            {/* Catch all: redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
