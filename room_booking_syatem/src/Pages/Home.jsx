// src/Pages/Home.jsx
import React, { useState } from 'react';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

export default function Home() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Dummy rooms data (replace with API call)
  const rooms = [
    { id: 1, name: 'Room A', capacity: 10, location: '1st Floor' },
    { id: 2, name: 'Room B', capacity: 20, location: '2nd Floor' },
  ];

  const handleSearch = (searchParams) => {
    console.log('Searching rooms for:', searchParams);
    setAvailableRooms(rooms);
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking request submitted:', bookingData);
    alert('Booking request submitted!');
    setSelectedRoom(null);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Welcome to the Room Booking System</h2>

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
