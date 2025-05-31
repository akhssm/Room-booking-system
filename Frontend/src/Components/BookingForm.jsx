import React, { useState, useEffect } from 'react';

export default function BookingForm({ room, onSubmit, onCancel, user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    number: '',
    purpose: '',
    paymentMethod: '',
    paymentDetails: '',
  });

  const [step, setStep] = useState(1); // Step 1: Booking Info, Step 2: Payment Info
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

  const validateBooking = () => {
    const { name, number, purpose } = formData;
    if (!name.trim() || !number.trim() || !purpose.trim()) {
      alert('Please fill in all fields.');
      return false;
    }
    if (!/^\d{10}$/.test(number)) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    const { paymentMethod, paymentDetails } = formData;
    if (!paymentMethod.trim() || !paymentDetails.trim()) {
      alert('Please provide valid payment details.');
      return false;
    }
    return true;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (validateBooking()) {
      setStep(2);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setLoading(true);

    // Simulate async payment processing delay
    setTimeout(() => {
      setLoading(false);
      // Prepare booking data to send to parent component
      onSubmit({
        roomId: room.id,
        roomName: room.name,
        name: formData.name,
        number: formData.number,
        purpose: formData.purpose,
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentDetails,
      });
    }, 1000);
  };

  return (
    <div className="border p-4 rounded bg-gray-50 shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Booking: {room.name} ({room.time})
      </h2>

      {step === 1 && (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
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
            type="text"
            name="number"
            placeholder="Phone Number"
            value={formData.number}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="purpose"
            placeholder="Purpose of Booking"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next: Payment
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
          </select>

          <input
            type="text"
            name="paymentDetails"
            placeholder="Payment Details (e.g. Card Number, UPI ID)"
            value={formData.paymentDetails}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
