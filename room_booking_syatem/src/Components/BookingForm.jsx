import React, { useState, useEffect } from 'react';

export default function BookingForm({ room, onSubmit, onCancel, user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    number: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
    }));
  }, [user?.name]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const number = formData.number.trim();
    const purpose = formData.purpose.trim();

    if (!name || !number || !purpose) {
      alert('Please fill in all fields.');
      return;
    }

    if (!/^\d{10}$/.test(number)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({ ...formData, name, number, purpose, roomName: room.name, roomId: room.id });
      setFormData({ name: user?.name || '', number: '', purpose: '' });
    } catch (error) {
      alert('Failed to submit booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-6 max-w-md w-full space-y-4"
        noValidate
      >
        <h2 className="text-xl font-bold mb-2">Book Room: {room.name}</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="tel"
          name="number"
          placeholder="Your Phone Number"
          value={formData.number}
          onChange={handleChange}
          pattern="^\\d{10}$"
          maxLength={10}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="purpose"
          placeholder="Purpose of Booking"
          value={formData.purpose}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded resize-none"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name.trim() || !formData.number.trim() || !formData.purpose.trim()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Room'}
          </button>
        </div>
      </form>
    </div>
  );
}
