// src/Pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

export default function Home({ userRole }) {
  const navigate = useNavigate();

  // Example rooms with available time slots per day (for demonstration)
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: 'Room A',
      capacity: 10,
      location: '1st Floor',
      // availability: Array of objects with date and time ranges room is free
      availability: [
        { date: '2025-05-29', startTime: '09:00', endTime: '12:00' },
        { date: '2025-05-30', startTime: '10:00', endTime: '14:00' },
      ],
    },
    {
      id: 2,
      name: 'Room B',
      capacity: 20,
      location: '2nd Floor',
      availability: [
        { date: '2025-05-29', startTime: '13:00', endTime: '17:00' },
        { date: '2025-05-30', startTime: '09:00', endTime: '11:00' },
      ],
    },
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Helper: convert "HH:mm" to minutes for easy comparison
  const timeToMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
  };

  // Check if search time range fits inside room availability time range
  const isTimeRangeWithin = (searchStart, searchEnd, availStart, availEnd) => {
    return (
      timeToMinutes(searchStart) >= timeToMinutes(availStart) &&
      timeToMinutes(searchEnd) <= timeToMinutes(availEnd)
    );
  };

  const handleSearch = ({ date, startTime, endTime }) => {
    console.log('Searching rooms for:', date, startTime, endTime);

    const filtered = rooms.filter((room) => {
      // Find availability for the searched date
      const availabilityForDate = room.availability.find(
        (slot) => slot.date === date
      );
      if (!availabilityForDate) {
        // No availability on that date, exclude room
        return false;
      }

      // Check if requested time fits in availability
      const isAvailable = isTimeRangeWithin(
        startTime,
        endTime,
        availabilityForDate.startTime,
        availabilityForDate.endTime
      );

      return isAvailable;
    });

    setAvailableRooms(filtered);
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking request submitted:', bookingData);
    alert('Booking request submitted!');
    setSelectedRoom(null);
  };

  const handleAddRoomRedirect = () => {
    navigate('/rooms?openCreateForm=true');
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome to the Room Booking System
      </h2>

      {userRole === 'admin' && (
        <button
          onClick={handleAddRoomRedirect}
          className="bg-green-600 text-white py-2 px-4 mb-6 rounded hover:bg-green-700"
        >
          ➕ Add Room
        </button>
      )}

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
