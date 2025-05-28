// src/Pages/Rooms.jsx
import React, { useState } from 'react';

export default function Rooms({ bookedRooms, user }) {
  const [createdRooms, setCreatedRooms] = useState([]);

  const handleCreateRoom = () => {
    const name = prompt('Enter room name:');
    const number = prompt('Enter room number:');
    const location = prompt('Enter location:');
    const capacity = prompt('Enter capacity:');

    if (name && number && location && capacity) {
      const newRoom = {
        id: Date.now(),
        name,
        number,
        location,
        capacity,
        createdBy: user.name,
      };
      setCreatedRooms((prev) => [...prev, newRoom]);
      alert('Room created successfully!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Booked Rooms</h1>

      {user.role === 'admin' && (
        <button
          onClick={handleCreateRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create Room
        </button>
      )}

      {createdRooms.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Created Rooms</h2>
          <ul className="space-y-2">
            {createdRooms.map((room) => (
              <li key={room.id} className="border p-4 rounded bg-white shadow">
                <div><strong>Name:</strong> {room.name}</div>
                <div><strong>Number:</strong> {room.number}</div>
                <div><strong>Location:</strong> {room.location}</div>
                <div><strong>Capacity:</strong> {room.capacity}</div>
                <div><strong>Created By:</strong> {room.createdBy}</div>
              </li>
            ))}
          </ul>
        </>
      )}

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
