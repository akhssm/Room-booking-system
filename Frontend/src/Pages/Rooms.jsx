// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import BookingForm from '../Components/BookingForm';

// // Define your backend URL as a constant for easier management
// const API_BASE_URL = 'http://localhost:5000/api';

// export default function Rooms({ user = {} }) {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const shouldShowForm = queryParams.get('openCreateForm') === 'true';

//   const [showCreateForm, setShowCreateForm] = useState(
//     shouldShowForm || user?.role === 'admin'
//   );

//   const [createdRooms, setCreatedRooms] = useState([]);
//   const [bookedRooms, setBookedRooms] = useState([]);

//   const [formData, setFormData] = useState({
//     name: '',
//     capacity: '',
//     date: '',
//     startTime: '',
//     endTime: '',
//     location: '',
//   });

//   const [editingRoomId, setEditingRoomId] = useState(null);
//   const [bookingRoom, setBookingRoom] = useState(null);

//   // Fetch rooms and bookings from backend on mount
//   useEffect(() => {
//     async function fetchRooms() {
//       try {
//         const roomsRes = await fetch(`${API_BASE_URL}/rooms`);
//         if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
//         const roomsData = await roomsRes.json();
//         setCreatedRooms(roomsData);
//       } catch (error) {
//         // Log the actual error object for more detail
//         console.error('Error fetching rooms:', error);
//         alert(`Error fetching rooms: ${error.message}`);
//       }
//     }

//     async function fetchBookings() {
//       try {
//         const bookingsRes = await fetch(`${API_BASE_URL}/bookings`);
//         if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
//         const bookingsData = await bookingsRes.json();
//         setBookedRooms(bookingsData);
//       } catch (error) {
//         // Log the actual error object for more detail
//         console.error('Error fetching bookings:', error);
//         alert(`Error fetching bookings: ${error.message}`);
//       }
//     }

//     fetchRooms();
//     fetchBookings();
//   }, []);

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       capacity: '',
//       date: '',
//       startTime: '',
//       endTime: '',
//       location: '',
//     });
//     setEditingRoomId(null);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       alert('Room Name cannot be empty.');
//       return;
//     }

//     if (!formData.date) {
//       alert('Please select a date.');
//       return;
//     }

//     if (!formData.startTime || !formData.endTime) {
//         alert('Please select both start and end times.');
//         return;
//     }

//     // Convert times to a comparable format (e.g., minutes since midnight or just compare strings directly if consistent 'HH:MM')
//     // A more robust check might involve Date objects, but for simple time comparison, string comparison works if format is 'HH:MM'
//     if (formData.startTime >= formData.endTime) {
//       alert('End time must be after start time.');
//       return;
//     }

//     const capacityNumber = Number(formData.capacity);
//     if (!formData.capacity || isNaN(capacityNumber) || capacityNumber < 1) {
//       alert('Capacity must be a positive number.');
//       return;
//     }

//     if (!formData.location.trim()) {
//       alert('Location cannot be empty.');
//       return;
//     }

//     const roomPayload = {
//       name: formData.name.trim(), // Trim whitespace
//       capacity: capacityNumber,
//       date: formData.date,
//       startTime: formData.startTime, // Send separately for backend validation
//       endTime: formData.endTime,     // Send separately for backend validation
//       time: `${formData.startTime} - ${formData.endTime}`, // Keep for display, but backend might prefer separate
//       location: formData.location.trim(), // Trim whitespace
//       createdBy: user?.name || 'Unknown',
//     };

//     // --- IMPORTANT: Debugging Step ---
//     console.log('Sending room payload:', roomPayload);
//     // ---------------------------------

//     try {
//       let res;
//       let action;

//       if (editingRoomId) {
//         action = 'update';
//         res = await fetch(`${API_BASE_URL}/rooms/${editingRoomId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(roomPayload),
//         });
//       } else {
//         action = 'create';
//         res = await fetch(`${API_BASE_URL}/rooms`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(roomPayload),
//         });
//       }

//       if (!res.ok) {
//         // Read the error response from the server if available
//         const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
//         throw new Error(`Failed to ${action} room: ${errorData.message || res.statusText}`);
//       }

//       const responseData = await res.json();

//       if (action === 'update') {
//         setCreatedRooms((prev) =>
//           prev.map((room) => (room.id === editingRoomId ? responseData : room))
//         );
//         alert('Room updated successfully!');
//       } else {
//         setCreatedRooms((prev) => [...prev, responseData]);
//         alert('Room created successfully!');
//       }
//       resetForm();
//     } catch (error) {
//       console.error(`Error during room submission (${editingRoomId ? 'update' : 'create'}):`, error);
//       alert(error.message);
//     }
//   };

//   const handleEdit = (room) => {
//     // Make sure 'room.time' exists before splitting
//     const [startTime, endTime] = room.time ? room.time.split(' - ') : ['', ''];

//     setFormData({
//       name: room.name,
//       capacity: String(room.capacity),
//       date: room.date || '',
//       startTime: startTime,
//       endTime: endTime,
//       location: room.location,
//     });
//     setEditingRoomId(room.id);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this room?')) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/rooms/${id}`, { method: 'DELETE' });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
//         throw new Error(`Failed to delete room: ${errorData.message || res.statusText}`);
//       }
//       setCreatedRooms((prev) => prev.filter((room) => room.id !== id));
//       if (editingRoomId === id) resetForm();
//       alert('Room deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting room:', error);
//       alert(error.message);
//     }
//   };

//   const handleBookRoom = (room) => {
//     setBookingRoom(room);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleBookingFormClose = () => {
//     setBookingRoom(null);
//   };

//   const handleBookingSubmit = async (bookingData) => {
//     try {
//       const room = createdRooms.find((r) => r.id === bookingData.roomId);

//       if (!room) {
//         alert('Selected room no longer exists. Please refresh the page.');
//         return;
//       }

//       const bookingPayload = {
//         roomId: bookingData.roomId,
//         name: bookingData.name, // This is the user's name from the form
//         number: bookingData.number,
//         purpose: bookingData.purpose,
//         roomName: room.name, // Add roomName from the selected room
//         status: 'Booked',
//         time: room.time || '', // Populate time from the selected room
//         bookedBy: user?.name || 'Unknown', // Explicitly add who booked it
//       };

//       // --- IMPORTANT: Debugging Step ---
//       console.log('Sending booking payload:', bookingPayload);
//       // ---------------------------------

//       const res = await fetch(`${API_BASE_URL}/bookings`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bookingPayload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
//         throw new Error(`Failed to book room: ${errorData.message || res.statusText}`);
//       }
//       const bookedRoom = await res.json();

//       setBookedRooms((prev) => [...prev, bookedRoom]);
//       alert(`Room "${bookedRoom.roomName}" booked by ${bookedRoom.bookedBy || bookedRoom.name} successfully!`);
//       setBookingRoom(null);
//     } catch (error) {
//       console.error('Error during booking submission:', error);
//       alert(error.message);
//     }
//   };

//   const handleDeleteBooking = async (id) => {
//     if (!window.confirm('Are you sure you want to cancel this booking?')) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
//         throw new Error(`Failed to cancel booking: ${errorData.message || res.statusText}`);
//       }
//       setBookedRooms((prev) => prev.filter((booking) => booking.id !== id));
//       alert('Booking canceled successfully!');
//     } catch (error) {
//       console.error('Error deleting booking:', error);
//       alert(error.message);
//     }
//   };

//   const handleConfirmBooking = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/bookings/${id}/confirm`, { method: 'PATCH' });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
//         throw new Error(`Failed to confirm booking: ${errorData.message || res.statusText}`);
//       }
//       const updatedBooking = await res.json();
//       setBookedRooms((prev) =>
//         prev.map((booking) => (booking.id === id ? updatedBooking : booking))
//       );
//       alert('Booking confirmed!');
//     } catch (error) {
//       console.error('Error confirming booking:', error);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold">Created Rooms</h1>

//       {showCreateForm && (
//         <form
//           onSubmit={handleFormSubmit}
//           className="border p-4 rounded bg-gray-100 space-y-4"
//         >
//           <h2 className="text-xl font-semibold">
//             {editingRoomId ? 'Edit Room' : 'Create New Room'}
//           </h2>

//           <input
//             type="text"
//             placeholder="Room Name"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, name: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <input
//             type="number"
//             placeholder="Capacity"
//             min={1}
//             value={formData.capacity}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, capacity: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <label className="block font-medium">Date</label>
//           <input
//             type="date"
//             value={formData.date}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, date: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <label className="block font-medium">Start Time</label>
//           <input
//             type="time"
//             value={formData.startTime}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, startTime: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <label className="block font-medium">End Time</label>
//           <input
//             type="time"
//             value={formData.endTime}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, endTime: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <input
//             type="text"
//             placeholder="Location"
//             value={formData.location}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, location: e.target.value }))
//             }
//             required
//             className="w-full p-2 border rounded"
//           />

//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               {editingRoomId ? 'Update Room' : 'Create Room'}
//             </button>

//             {editingRoomId && (
//               <button
//                 type="button"
//                 className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
//                 onClick={resetForm}
//               >
//                 Cancel Edit
//               </button>
//             )}
//           </div>
//         </form>
//       )}

//       <button
//         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         onClick={() => setShowCreateForm((prev) => !prev)}
//       >
//         {showCreateForm ? 'Hide Form' : 'Add New Room'}
//       </button>

//       <div className="space-y-4">
//         {createdRooms.length === 0 ? (
//           <p>No rooms created yet.</p>
//         ) : (
//           createdRooms.map((room) => (
//             <div
//               key={room.id}
//               className="border rounded p-4 bg-white flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-lg">{room.name}</h3>
//                 <p>Capacity: {room.capacity}</p>
//                 <p>Date: {room.date || 'N/A'}</p>
//                 <p>Time: {room.time || 'N/A'}</p>
//                 <p>Location: {room.location}</p>
//                 <p>Created By: {room.createdBy}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                   onClick={() => handleEdit(room)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                   onClick={() => handleDelete(room.id)}
//                 >
//                   Delete
//                 </button>
//                 {/* CONDITIONAL RENDERING FOR BOOK BUTTON */}
//                 {user?.role !== 'admin' && ( // Only show if user is NOT an admin
//                   <button
//                     className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                     onClick={() => handleBookRoom(room)}
//                   >
//                     Book
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Booking Form Modal */}
//       {bookingRoom && (
//         <BookingForm
//           room={bookingRoom}
//           onCancel={handleBookingFormClose}
//           onSubmit={handleBookingSubmit}
//           user={user}
//         />
//       )}

//       <h2 className="text-2xl font-bold mt-8">Booked Rooms</h2>
//       <div className="space-y-2">
//         {bookedRooms.length === 0 ? (
//           <p>No rooms booked yet.</p>
//         ) : (
//           bookedRooms.map((booking) => (
//             <div
//               key={booking.id}
//               className={`border rounded p-3 bg-white flex justify-between items-center ${
//                 booking.status === 'Confirmed'
//                   ? 'border-green-500'
//                   : booking.status === 'Booked'
//                   ? 'border-yellow-500'
//                   : ''
//               }`}
//             >
//               <div>
//                 <h3 className="font-semibold text-lg">{booking.name}</h3>
//                 <p>Booked By: {booking.bookedBy || 'N/A'}</p>
//                 <p>Number: {booking.number}</p>
//                 <p>Purpose: {booking.purpose}</p>
//                 <p>Status: {booking.status}</p>
//                 <p>Time: {booking.time || 'N/A'}</p>
//               </div>
//               <div className="flex gap-2">
//                 {/* Admin can confirm booked rooms */}
//                 {booking.status === 'Booked' && user?.role === 'admin' && (
//                   <button
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                     onClick={() => handleConfirmBooking(booking.id)}
//                   >
//                     Confirm
//                   </button>
//                 )}

//                 {/* User who booked can cancel if not confirmed */}
//                 {booking.bookedBy === user?.name && booking.status !== 'Confirmed' && (
//                   <button
//                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                     onClick={() => handleDeleteBooking(booking.id)}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


















































import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookingForm from '../Components/BookingForm'; // Assuming BookingForm is in '../Components/BookingForm.jsx'

// Define your backend URL as a constant for easier management
const API_BASE_URL = 'http://localhost:5000/api';

export default function Rooms({ user = {} }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shouldShowForm = queryParams.get('openCreateForm') === 'true';

  // State to control visibility of the create/edit room form
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createdRooms, setCreatedRooms] = useState([]);
  const [bookedRooms, setBookedRooms] = useState([]); // This will store ALL bookings
  const [userBookings, setUserBookings] = useState([]); // State to store filtered user bookings

  // NEW STATE: For filtering by date
  const [filterDate, setFilterDate] = useState(''); // Stores the selected date for filtering

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [editingRoomId, setEditingRoomId] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);

  // Fetch rooms and bookings from backend on mount
  useEffect(() => {
    async function fetchRooms() {
      try {
        const roomsRes = await fetch(`${API_BASE_URL}/rooms`);
        if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
        const roomsData = await roomsRes.json();
        setCreatedRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert(`Error fetching rooms: ${error.message}`);
      }
    }

    async function fetchBookings() {
      try {
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings`);
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        setBookedRooms(bookingsData); // Store all bookings
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert(`Error fetching bookings: ${error.message}`);
      }
    }

    fetchRooms();
    fetchBookings();

    // Set initial filter date to today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    setFilterDate(`${year}-${month}-${day}`);

  }, []);

  // NEW: Filter bookings whenever bookedRooms or user changes
  useEffect(() => {
    if (user?.name) {
      const filtered = bookedRooms.filter(
        (booking) => booking.bookedBy === user.name
      );
      setUserBookings(filtered);
    } else {
      setUserBookings([]); // Clear user bookings if no user is logged in
    }
  }, [bookedRooms, user]);

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setEditingRoomId(null);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Room Name cannot be empty.');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert('Please select both start and end times.');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time.');
      return;
    }

    const capacityNumber = Number(formData.capacity);
    if (!formData.capacity || isNaN(capacityNumber) || capacityNumber < 1) {
      alert('Capacity must be a positive number.');
      return;
    }

    if (!formData.location.trim()) {
      alert('Location cannot be empty.');
      return;
    }

    const roomPayload = {
      name: formData.name.trim(),
      capacity: capacityNumber,
      startTime: formData.startTime,
      endTime: formData.endTime,
      time: `${formData.startTime} - ${formData.endTime}`, // Combined time string
      location: formData.location.trim(),
      createdBy: user?.name || 'Unknown',
    };

    console.log('Sending room payload:', roomPayload);

    try {
      let res;
      let action;

      if (editingRoomId) {
        action = 'update';
        res = await fetch(`${API_BASE_URL}/rooms/${editingRoomId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomPayload),
        });
      } else {
        action = 'create';
        res = await fetch(`${API_BASE_URL}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomPayload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to ${action} room: ${errorData.message || res.statusText}`);
      }

      const responseData = await res.json();

      if (action === 'update') {
        setCreatedRooms((prev) =>
          prev.map((room) => (room.id === editingRoomId ? responseData : room))
        );
        alert('Room updated successfully!');
      } else {
        setCreatedRooms((prev) => [...prev, responseData]);
        alert('Room created successfully!');
      }
      resetForm();
    } catch (error) {
      console.error(`Error during room submission (${editingRoomId ? 'update' : 'create'}):`, error);
      alert(error.message);
    }
  };

  const handleEdit = (room) => {
    const [startTime, endTime] = room.time ? room.time.split(' - ') : ['', ''];

    setFormData({
      name: room.name,
      capacity: String(room.capacity),
      startTime: startTime,
      endTime: endTime,
      location: room.location,
    });
    setEditingRoomId(room.id);
    setShowCreateForm(true); // Show the form when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to delete room: ${errorData.message || res.statusText}`);
      }
      setCreatedRooms((prev) => prev.filter((room) => room.id !== id));
      if (editingRoomId === id) resetForm();
      alert('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      alert(error.message);
    }
  };

  const handleBookRoom = (room) => {
    setBookingRoom(room);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingFormClose = () => {
    setBookingRoom(null);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const room = createdRooms.find((r) => r.id === bookingData.roomId);

      if (!room) {
        alert('Selected room no longer exists. Please refresh the page.');
        return;
      }

      const bookingPayload = {
        roomId: bookingData.roomId,
        roomName: room.name,
        bookerName: bookingData.name,
        bookerNumber: bookingData.number,
        purpose: bookingData.purpose,
        status: 'Booked',
        bookingTime: room.time, // Use the room's defined time
        bookingDate: bookingData.bookingDate, // Specific date from BookingForm
        bookedBy: user?.name || 'Unknown',
        paymentMethod: bookingData.paymentMethod,
        paymentDetails: bookingData.paymentDetails,
      };

      console.log('Sending booking payload:', bookingPayload);

      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to book room: ${errorData.message || res.statusText}`);
      }
      const newBooking = await res.json();

      setBookedRooms((prev) => [...prev, newBooking]); // Update all bookings
      alert(`Room "${newBooking.roomName}" booked by ${newBooking.bookerName} successfully!`);
      setBookingRoom(null);
    } catch (error) {
      console.error('Error during booking submission:', error);
      alert(error.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to cancel booking: ${errorData.message || res.statusText}`);
      }
      setBookedRooms((prev) => prev.filter((booking) => booking.id !== id));
      alert('Booking canceled successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(error.message);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/confirm`, { method: 'PATCH' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'No error message from server.' }));
        throw new Error(`Failed to confirm booking: ${errorData.message || res.statusText}`);
      }
      const updatedBooking = await res.json();
      setBookedRooms((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      alert('Booking confirmed!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(error.message);
    }
  };

  // NEW: Filtered lists based on selected date
  const filteredBookings = bookedRooms.filter(booking =>
    filterDate ? booking.bookingDate === filterDate : true // Filter if filterDate is set
  );

  const filteredUserBookings = userBookings.filter(booking =>
    filterDate ? booking.bookingDate === filterDate : true // Filter if filterDate is set
  );


  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Rooms Management</h1>

      {user?.role === 'admin' && (
        <>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              setShowCreateForm((prev) => !prev);
              resetForm();
            }}
          >
            {showCreateForm ? 'Hide Room Form' : 'Add New Room'}
          </button>

          {showCreateForm && (
            <form
              onSubmit={handleFormSubmit}
              className="border p-4 rounded bg-gray-100 space-y-4 mt-4"
            >
              <h2 className="text-xl font-semibold">
                {editingRoomId ? 'Edit Room' : 'Create New Room'}
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
              />

              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                min={1}
                value={formData.capacity}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
              />

              <label htmlFor="startTime" className="block font-medium">Start Time (Daily Availability)</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
              />

              <label htmlFor="endTime" className="block font-medium">End Time (Daily Availability)</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingRoomId ? 'Update Room' : 'Create Room'}
                </button>

                {editingRoomId && (
                  <button
                    type="button"
                    className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </>
      )}

      {/* Date Filter Input */}
      <div className="mt-6 p-4 border rounded bg-white">
        <label htmlFor="filterDate" className="block text-lg font-semibold mb-2">
          Filter by Date:
        </label>
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full p-2 border rounded text-lg"
        />
      </div>

      {/* List of Created Rooms - Not directly filtered by date here, as they are universally available */}
      <h2 className="text-2xl font-bold mt-8">Available Rooms (General Daily Availability)</h2>
      <div className="space-y-4">
        {createdRooms.length === 0 ? (
          <p>No rooms created yet.</p>
        ) : (
          createdRooms.map((room) => (
            <div
              key={room.id}
              className="border rounded p-4 bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <p>Capacity: {room.capacity}</p>
                <p>Available Time: {room.time || 'N/A'}</p>
                <p>Location: {room.location}</p>
                <p>Created By: {room.createdBy}</p>
              </div>
              <div className="flex gap-2">
                {user?.role === 'admin' ? (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(room)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleBookRoom(room)}
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Form Modal */}
      {bookingRoom && (
        <BookingForm
          room={bookingRoom}
          onCancel={handleBookingFormClose}
          onSubmit={handleBookingSubmit}
          user={user}
        />
      )}

      {/* Booked Rooms List (Filtered by date) */}
      <h2 className="text-2xl font-bold mt-8">
        {user?.role === 'admin' ? 'All Booked Rooms' : 'My Booked Rooms'}
        {filterDate && ` for ${filterDate}`} {/* Display filter date */}
      </h2>
      <div className="space-y-2">
        {(user?.role === 'admin' ? filteredBookings : filteredUserBookings).length === 0 ? (
          <p>No rooms booked for the selected date yet.</p>
        ) : (
          (user?.role === 'admin' ? filteredBookings : filteredUserBookings).map((booking) => (
            <div
              key={booking.id}
              className={`border rounded p-3 bg-white flex justify-between items-center ${
                booking.status === 'Confirmed'
                  ? 'border-green-500'
                  : booking.status === 'Booked'
                  ? 'border-yellow-500'
                  : ''
              }`}
            >
              <div>
                <h3 className="font-semibold text-lg">{booking.roomName}</h3>
                <p>Booked By: {booking.bookedBy || 'N/A'}</p>
                <p>Contact: {booking.bookerName} ({booking.bookerNumber})</p>
                <p>Purpose: {booking.purpose}</p>
                <p>Status: {booking.status}</p>
                <p>Booking Date: {booking.bookingDate || 'N/A'}</p>
                <p>Booking Time: {booking.bookingTime || 'N/A'}</p>
                <p>Payment Method: {booking.paymentMethod}</p>
                <p>Payment Details: {booking.paymentDetails}</p>
              </div>
              <div className="flex gap-2">
                {user?.role === 'admin' ? (
                  <>
                    {booking.status === 'Booked' && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => handleConfirmBooking(booking.id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  booking.bookedBy === user?.name && booking.status !== 'Confirmed' && (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Cancel My Booking
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}