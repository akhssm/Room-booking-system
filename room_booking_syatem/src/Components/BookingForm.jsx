// src/components/BookingForm.jsx
import React, { useState } from 'react';

export default function BookingForm({ room, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ roomId: room.id, name, purpose });
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Room: {room.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Purpose</label>
          <textarea
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
