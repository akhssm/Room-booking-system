import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Rooms({ bookedRooms = [], user = {} }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shouldShowForm = queryParams.get('create') === 'true';

  const [showCreateForm, setShowCreateForm] = useState(shouldShowForm || user.role === 'admin');
  const [createdRooms, setCreatedRooms] = useState(() => {
    const stored = localStorage.getItem('createdRooms');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    localStorage.setItem('createdRooms', JSON.stringify(createdRooms));
  }, [createdRooms]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.date) return alert('Please select a date.');
    if (formData.startTime >= formData.endTime) return alert('End time must be after start time.');

    if (editingRoomId) {
      setCreatedRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoomId
            ? { ...room, ...formData, time: `${formData.startTime} - ${formData.endTime}` }
            : room
        )
      );
      alert('Room updated successfully!');
    } else {
      const newRoom = {
        id: Date.now(),
        ...formData,
        time: `${formData.startTime} - ${formData.endTime}`,
        createdBy: user.name || 'Unknown',
      };
      setCreatedRooms((prev) => [...prev, newRoom]);
      alert('Room created successfully!');
    }

    resetForm();
  };

  const handleEdit = (room) => {
    setFormData({
      name: room.name,
      capacity: room.capacity,
      date: room.date || '',
      startTime: room.time?.split(' - ')[0] || '',
      endTime: room.time?.split(' - ')[1] || '',
      location: room.location,
    });
    setEditingRoomId(room.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setCreatedRooms((prev) => prev.filter((room) => room.id !== id));
      if (editingRoomId === id) resetForm();
    }
  };

  const handleBookRoom = (room) => {
    alert(`You booked room: ${room.name}`);
    // Add your actual booking logic here (e.g., update bookedRooms or call an API)
  };

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setEditingRoomId(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Booked Rooms</h1>

      {showCreateForm && (
        <form onSubmit={handleFormSubmit} className="border p-4 rounded bg-gray-100 space-y-4">
          <h2 className="text-xl font-semibold">{editingRoomId ? 'Edit Room' : 'Create New Room'}</h2>

          <input
            type="text"
            placeholder="Room Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <label className="block font-medium">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <label className="block font-medium">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <label className="block font-medium">End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingRoomId ? 'Update Room' : 'Submit Room'}
            </button>
            {editingRoomId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {createdRooms.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Created Rooms</h2>
          <ul className="space-y-2">
            {createdRooms.map((room) => (
              <li
                key={room.id}
                className="border p-4 rounded bg-white shadow flex justify-between items-start"
              >
                <div>
                  <div><strong>Name:</strong> {room.name}</div>
                  <div><strong>Date:</strong> {room.date}</div>
                  <div><strong>Location:</strong> {room.location}</div>
                  <div><strong>Capacity:</strong> {room.capacity}</div>
                  <div><strong>Time Slot:</strong> {room.time}</div>
                  <div><strong>Created By:</strong> {room.createdBy}</div>
                </div>
                <div className="space-x-2">
                  {user.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleEdit(room)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Book Room
                    </button>
                  )}
                </div>
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
