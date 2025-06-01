// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log("Logged out");
    navigate('/login');
  };

  const hideButtons = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Empty div for left alignment (optional if you want perfect centering) */}
      <div className="w-1/3"></div>

      {/* Centered Title */}
      <h1 className="text-2xl font-bold text-center w-1/3">Room Booking System</h1>

      {/* Right-aligned buttons */}
      {!hideButtons ? (
        <div className="space-x-4 w-1/3 flex justify-end">
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
      ) : (
        <div className="w-1/3"></div>
      )}
    </header>
  );
}
