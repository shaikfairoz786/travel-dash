import React, { useState } from 'react';
import { API_BASE_URL } from "../config/api"; // ✅ import the config file

interface BookingModalProps {
  packageId: string;
  packageName: string;
  price: number;
  onClose: () => void;
  onBook: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ packageId, packageName, price, onClose, onBook }) => {
  const [quantity, setQuantity] = useState(1);
  const [travelStart, setTravelStart] = useState('');
  // const [travelEnd, setTravelEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = quantity * price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData: {
        packageId: string;
        quantity: number;
        travelStart: string;
        // travelEnd: string;
        notes?: string;
      } = {
        packageId,
        quantity,
        travelStart,
        // travelEnd,
      };

      if (notes.trim()) {
        bookingData.notes = notes.trim();
      }

      // ✅ Updated API endpoint with dynamic base URL
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      await response.json();
      alert('Booking created successfully!');
      onBook();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book {packageName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 text-sm font-semibold mb-2">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="travelStart" className="block text-gray-700 text-sm font-semibold mb-2">Travel Start Date:</label>
            <input
              type="date"
              id="travelStart"
              value={travelStart}
              onChange={(e) => setTravelStart(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
              required
            />
          </div>

          {/* <div className="mb-4">
            <label htmlFor="travelEnd" className="block text-gray-700 text-sm font-semibold mb-2">Travel End Date:</label>
            <input
              type="date"
              id="travelEnd"
              value={travelEnd}
              onChange={(e) => setTravelEnd(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
              required
            />
          </div> */}

          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">Notes (optional):</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
              rows={3}
              placeholder="Any special requests or information?"
            ></textarea>
          </div>

          <div className="mb-8 text-center">
            <p className="text-2xl font-bold text-gray-800">
              Total Price: <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
