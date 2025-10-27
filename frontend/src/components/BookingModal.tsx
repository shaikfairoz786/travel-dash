import React, { useState } from 'react';

interface BookingModalProps {
  packageId: string;
  packageName: string;
  price: number;
  onClose: () => void;
  onBook: (bookingDetails: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ packageId, packageName, price, onClose, onBook }) => {
  const [quantity, setQuantity] = useState(1);
  const [travelStart, setTravelStart] = useState('');
  const [travelEnd, setTravelEnd] = useState('');
  const [notes, setNotes] = useState('');

  const totalPrice = quantity * price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook({
      packageId,
      quantity,
      travelStart,
      travelEnd,
      notes,
      totalPrice,
    });
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
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="travelEnd" className="block text-gray-700 text-sm font-semibold mb-2">Travel End Date:</label>
            <input
              type="date"
              id="travelEnd"
              value={travelEnd}
              onChange={(e) => setTravelEnd(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">Notes (optional):</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              rows={3}
              placeholder="Any special requests or information?"
            ></textarea>
          </div>
          <div className="mb-8 text-center">
            <p className="text-2xl font-bold text-gray-800">Total Price: <span className="text-indigo-600">{price.toFixed(2)} {packageName}</span></p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
