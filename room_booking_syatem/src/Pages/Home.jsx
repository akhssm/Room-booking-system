// src/Pages/Home.jsx
import React, { useState } from 'react';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

export default function Home({ userRole }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '', location: '' });

  // Dummy initial data
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room A', capacity: 10, location: '1st Floor' },
    { id: 2, name: 'Room B', capacity: 20, location: '2nd Floor' },
  ]);

  const handleSearch = (searchParams) => {
    console.log('Searching rooms for:', searchParams);
    setAvailableRooms(rooms); // Simulate search result
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking request submitted:', bookingData);
    alert('Booking request submitted!');
    setSelectedRoom(null);
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newId = rooms.length + 1;
    const roomToAdd = {
      id: newId,
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      location: newRoom.location,
    };
    setRooms([...rooms, roomToAdd]);
    setNewRoom({ name: '', capacity: '', location: '' });
    alert('Room added successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome to the Room Booking System</h2>

      {/* Admin Add Room Section */}
      {userRole === 'admin' && (
        <form onSubmit={handleAddRoom} className="mb-6 space-y-4 border p-4 rounded">
          <h3 className="text-xl font-semibold text-gray-700">Add New Room</h3>
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={newRoom.location}
            onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Room
          </button>
        </form>
      )}

      {/* User / Admin shared functionality */}
      {!selectedRoom ? (
        <>
          <SearchRooms onSearch={handleSearch} />
          <RoomList rooms={availableRooms} onSelect={setSelectedRoom} />
        </>
      ) : (
        <BookingForm
          room={selectedRoom}
          onSubmit={handleBookingSubmit}
          onCancel={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
