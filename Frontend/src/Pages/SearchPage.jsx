import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

export default function SearchPage({ onBook }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [timeInfo, setTimeInfo] = useState({});
  const navigate = useNavigate(); // ✅

  const handleSearch = ({ date, startTime, endTime }) => {
    setTimeInfo({ date, startTime, endTime });
    setAvailableRooms([
      { id: 3, name: 'Classroom A', capacity: 30, location: 'Building 1', number: '101' },
      { id: 4, name: 'Classroom B', capacity: 25, location: 'Building 2', number: '102' }
    ]);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom({ ...room, ...timeInfo });
  };

  const handleBookingSubmit = ({ roomId, name, purpose }) => {
    const room = availableRooms.find((r) => r.id === roomId);
    if (room) {
      const newBooking = {
        name: room.name,
        number: room.number,
        time: `${timeInfo.startTime} - ${timeInfo.endTime}`,
        bookedBy: name,
        purpose
      };
      onBook(newBooking);
      navigate('/rooms'); // ✅ Redirect
    }
    setSelectedRoom(null);
  };

  return (
    <div className="p-4 space-y-4">
      {!selectedRoom ? (
        <>
          <SearchRooms onSearch={handleSearch} />
          <RoomList rooms={availableRooms} onSelect={handleSelectRoom} />
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
