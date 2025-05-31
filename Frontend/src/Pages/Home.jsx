// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SearchRooms from '../Components/SearchRooms';
// import RoomList from '../Components/RoomList';
// import BookingForm from '../Components/BookingForm';

// export default function Home({ userRole }) {
//   const navigate = useNavigate();

//   // Instead of hardcoded rooms, load from localStorage (same as Rooms page)
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const storedRooms = localStorage.getItem('createdRooms');
//     if (storedRooms) {
//       setRooms(JSON.parse(storedRooms));
//     }
//   }, []);

//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   // Helper: convert "HH:mm" to minutes for easy comparison
//   const timeToMinutes = (timeStr) => {
//     const [hh, mm] = timeStr.split(':').map(Number);
//     return hh * 60 + mm;
//   };

//   // Check if search time range fits inside room availability time range
//   // Your Rooms store time as a string like "09:00 - 12:00"
//   const isTimeRangeWithin = (searchStart, searchEnd, availStart, availEnd) => {
//     return (
//       timeToMinutes(searchStart) >= timeToMinutes(availStart) &&
//       timeToMinutes(searchEnd) <= timeToMinutes(availEnd)
//     );
//   };

//   const handleSearch = ({ date, startTime, endTime }) => {
//     console.log('Searching rooms for:', date, startTime, endTime);

//     const filtered = rooms.filter((room) => {
//       // Each room has a single date and time slot (not an array)
//       if (room.date !== date) {
//         return false;
//       }

//       const [availStart, availEnd] = room.time.split(' - ');

//       return isTimeRangeWithin(startTime, endTime, availStart, availEnd);
//     });

//     setAvailableRooms(filtered);
//   };

//   const handleBookingSubmit = (bookingData) => {
//     console.log('Booking request submitted:', bookingData);
//     alert('Booking request submitted!');
//     setSelectedRoom(null);
//   };

//   const handleAddRoomRedirect = () => {
//     navigate('/rooms?openCreateForm=true');
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Welcome to the Room Booking System
//       </h2>

//       {userRole === 'admin' && (
//         <button
//           onClick={handleAddRoomRedirect}
//           className="bg-green-600 text-white py-2 px-4 mb-6 rounded hover:bg-green-700"
//         >
//           ➕ Add Room
//         </button>
//       )}

//       {!selectedRoom ? (
//         <>
//           <SearchRooms onSearch={handleSearch} />
//           <RoomList rooms={availableRooms} onSelect={setSelectedRoom} />
//         </>
//       ) : (
//         <BookingForm
//           room={selectedRoom}
//           onSubmit={handleBookingSubmit}
//           onCancel={() => setSelectedRoom(null)}
//         />
//       )}
//     </div>
//   );
// }

















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRooms from '../Components/SearchRooms';
import RoomList from '../Components/RoomList';
import BookingForm from '../Components/BookingForm';

// Define your backend URL as a constant
const API_BASE_URL = 'http://localhost:5000/api';

export default function Home({ user }) { // Pass user prop to Home component if it's needed
  const navigate = useNavigate();

  const [allRooms, setAllRooms] = useState([]); // Stores ALL rooms fetched from the backend
  const [availableRooms, setAvailableRooms] = useState([]); // Stores rooms matching search criteria
  const [selectedRoom, setSelectedRoom] = useState(null);

  // --- Core change: Fetch all rooms from backend ONCE when the component mounts ---
  useEffect(() => {
    async function fetchAllRooms() {
      try {
        const roomsRes = await fetch(`${API_BASE_URL}/rooms`);
        if (!roomsRes.ok) {
          throw new Error('Failed to fetch rooms from backend');
        }
        const roomsData = await roomsRes.json();
        setAllRooms(roomsData); // Store all fetched rooms
        console.log('Fetched rooms from backend:', roomsData); // For debugging
      } catch (error) {
        console.error('Error fetching all rooms for Home page:', error);
        alert(`Error fetching rooms: ${error.message}`);
      }
    }
    fetchAllRooms();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Helper: convert "HH:mm" to minutes for easy comparison
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0; // Handle cases where timeStr might be undefined/null
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
  };

  // Check if search time range fits inside room availability time range
  const isTimeRangeWithin = (searchStart, searchEnd, availStart, availEnd) => {
    const searchStartMin = timeToMinutes(searchStart);
    const searchEndMin = timeToMinutes(searchEnd);
    const availStartMin = timeToMinutes(availStart);
    const availEndMin = timeToMinutes(availEnd);

    // Search time must start at or after available start time,
    // and end at or before available end time.
    return searchStartMin >= availStartMin && searchEndMin <= availEndMin;
  };

  const handleSearch = ({ date, startTime, endTime }) => {
    console.log('Searching rooms for:', date, startTime, endTime);

    // Filter from the 'allRooms' state, which contains data from the backend
    const filtered = allRooms.filter((room) => {
      // Ensure room.date and room.time exist before filtering
      if (!room.date || !room.time) {
        return false;
      }

      // Important: Ensure date format consistency.
      // If backend sends 'YYYY-MM-DDTHH:mm:ss.sssZ', convert to 'YYYY-MM-DD' for comparison.
      // If backend stores just 'YYYY-MM-DD', direct comparison is fine.
      const roomDate = new Date(room.date).toISOString().split('T')[0]; // Adjust as per your actual backend date format

      if (roomDate !== date) { // Match by date
        return false;
      }

      const [availStart, availEnd] = room.time.split(' - ');

      // Ensure both availStart and availEnd are valid strings before passing
      if (!availStart || !availEnd) {
          console.warn(`Room ${room.id} has invalid time format: ${room.time}`);
          return false;
      }

      return isTimeRangeWithin(startTime, endTime, availStart, availEnd);
    });

    setAvailableRooms(filtered);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      // Find the room from 'allRooms' (which came from the backend)
      const room = allRooms.find((r) => r.id === bookingData.roomId);

      if (!room) {
        alert('Selected room no longer exists. Please refresh the page.');
        return;
      }

      const bookingPayload = {
        roomId: bookingData.roomId,
        name: bookingData.name, // This is the user's name from the form
        number: bookingData.number,
        purpose: bookingData.purpose,
        roomName: room.name, // Add roomName from the selected room
        status: 'Booked',
        time: bookingData.time || room.time || '', // Prioritize booking form time, fallback to room time
        bookedBy: user?.name || 'Unknown', // Explicitly add who booked it
      };

      console.log('Sending booking payload to backend:', bookingPayload);

      // --- This part still connects to the backend for booking ---
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to book room: ${errorData.message || res.statusText}`);
      }
      const bookedRoom = await res.json();

      alert(`Room "${bookedRoom.roomName}" booked by ${bookedRoom.bookedBy || bookedRoom.name} successfully!`);
      setSelectedRoom(null);
      // Optional: Redirect to rooms page or update bookings on current page if needed
      // navigate('/rooms');
    } catch (error) {
      console.error('Error during booking submission:', error);
      alert(error.message);
    }
  };

  const handleAddRoomRedirect = () => {
    navigate('/rooms?openCreateForm=true');
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome to the Room Booking System
      </h2>

      {/* Assuming user.role is passed as a prop from App.js */}
      {user?.role === 'admin' && (
        <button
          onClick={handleAddRoomRedirect}
          className="bg-green-600 text-white py-2 px-4 mb-6 rounded hover:bg-green-700"
        >
          ➕ Add Room (Admin Only)
        </button>
      )}

      {!selectedRoom ? (
        <>
          <SearchRooms onSearch={handleSearch} />
          {availableRooms.length > 0 ? (
            <RoomList rooms={availableRooms} onSelect={setSelectedRoom} />
          ) : (
            <p className="text-center text-gray-600 mt-4">
              {allRooms.length === 0 ? 'Loading rooms...' : 'No rooms found for the selected criteria. Try another search.'}
            </p>
          )}
        </>
      ) : (
        <BookingForm
          room={selectedRoom}
          onSubmit={handleBookingSubmit}
          onCancel={() => setSelectedRoom(null)}
          user={user} 
        />
      )}
    </div>
  );
}