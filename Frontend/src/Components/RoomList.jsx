// src/components/RoomList.jsx
import React from 'react';

export default function RoomList({ rooms, onSelect }) {
  if (!rooms.length) return <p className="p-4">No rooms available for the selected time.</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {rooms.map((room) => (
        <div key={room.id} className="border rounded p-4 shadow">
          <h3 className="font-bold text-lg">{room.name}</h3>
          <p>Capacity: {room.capacity}</p>
          <p>Location: {room.location}</p>
          <button
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={() => onSelect(room)}
          >
            Book this Room
          </button>
        </div>
      ))}
    </div>
  );
}
