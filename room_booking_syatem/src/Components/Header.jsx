// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear login info if needed
    console.log("Logged out");
    navigate('/login');
  };

  // Paths where buttons should NOT be shown
  const hideButtons = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Room Booking System</h1>

      {!hideButtons && (
        <div className="space-x-4">
          <Link to="/home" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            Home
          </Link>
          <Link to="/rooms" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            Rooms
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
