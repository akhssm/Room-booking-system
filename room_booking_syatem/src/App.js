// src/App.jsx
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

  // 🟢 This expects a complete new room booking object
  const handleBookRoom = (newBooking) => {
    setBookedRooms((prev) => [...prev, { ...newBooking, id: Date.now(), status: 'Pending' }]);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />

            {/* 🟢 Pass down bookedRooms */}
            <Route path="/rooms" element={<Rooms bookedRooms={bookedRooms} />} />
            {/* 🟢 Pass down booking handler */}
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
