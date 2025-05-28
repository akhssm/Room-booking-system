import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* Redirect default route to /login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Login route */}
            <Route path="/login" element={<Login />} />

            {/* Register route */}
            <Route path="/register" element={<Register />} />

            {/* Home route after login */}
            <Route path="/home" element={<Home />} />

            {/* Redirect unknown routes to /login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
