// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Rooms from './Pages/Rooms';
import SearchPage from './Pages/SearchPage';

function App() {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [userRole, setUserRole] = useState(null); // NEW: user role

  const handleBookRoom = (newBooking) => {
    const bookingWithId = {
      ...newBooking,
      id: Date.now(),
      status: 'Pending',
    };
    setBookedRooms((prev) => [...prev, bookingWithId]);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login setUserRole={setUserRole} />} />
            <Route path="/register" element={<Register />} />

            <Route path="/home" element={<Home userRole={userRole} />} />
            <Route path="/rooms" element={<Rooms bookedRooms={bookedRooms} />} />
            <Route path="/search" element={<SearchPage onBook={handleBookRoom} />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
