// src/components/Header.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex flex-col items-center space-y-2">
      <p className="text-sm">© {new Date().getFullYear()} All rights reserved</p>
      <div className="flex space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
          <FaFacebook size={20} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
          <FaTwitter size={20} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
          <FaInstagram size={20} />
        </a>
      </div>
    </header>
  );
}
