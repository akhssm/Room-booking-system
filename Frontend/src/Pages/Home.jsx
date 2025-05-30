import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

export default function Home({ userRole }) {
  const navigate = useNavigate();

  // Instead of hardcoded rooms, load from localStorage (same as Rooms page)
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem('createdRooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Helper: convert "HH:mm" to minutes for easy comparison
  const timeToMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
  };

  // Check if search time range fits inside room availability time range
  // Your Rooms store time as a string like "09:00 - 12:00"
  const isTimeRangeWithin = (searchStart, searchEnd, availStart, availEnd) => {
    return (
      timeToMinutes(searchStart) >= timeToMinutes(availStart) &&
      timeToMinutes(searchEnd) <= timeToMinutes(availEnd)
    );
  };

  const handleSearch = ({ date, startTime, endTime }) => {
    console.log('Searching rooms for:', date, startTime, endTime);

    const filtered = rooms.filter((room) => {
      // Each room has a single date and time slot (not an array)
      if (room.date !== date) {
        return false;
      }

      const [availStart, availEnd] = room.time.split(' - ');

      return isTimeRangeWithin(startTime, endTime, availStart, availEnd);
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
