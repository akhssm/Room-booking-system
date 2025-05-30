// src/components/SearchRooms.jsx
import React, { useState } from 'react';

export default function SearchRooms({ onSearch }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ date, startTime, endTime });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="flex space-x-4">
        <div>
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">End Time</label>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search Rooms
      </button>
    </form>
  );
}
