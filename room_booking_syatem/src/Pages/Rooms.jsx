// src/Pages/Rooms.jsx
import React from 'react';

export default function Rooms({ bookedRooms }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Booked Rooms</h1>

      {bookedRooms.length === 0 ? (
        <p className="text-gray-500">No rooms booked yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookedRooms.map((room) => (
            <li key={room.id} className="border p-4 rounded bg-white shadow">
              <div><strong>Name:</strong> {room.name}</div>
              <div><strong>Number:</strong> {room.number}</div>
              <div><strong>Time:</strong> {room.time}</div>
              <div><strong>Booked By:</strong> {room.bookedBy}</div>
              <div><strong>Purpose:</strong> {room.purpose}</div>
              <div><strong>Status:</strong> {room.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
