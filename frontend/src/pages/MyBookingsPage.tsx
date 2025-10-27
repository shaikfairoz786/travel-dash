import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

interface Booking {
  id: string;
  package: { title: string; slug: string };
  quantity: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  travelStart?: string;
  travelEnd?: string;
  notes?: string;
}

const MyBookingsPage: React.FC = () => {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        if (!accessToken) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/bookings/mine', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [accessToken]);

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You have no bookings yet. Start exploring our amazing packages!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Package: {booking.package.title}</h2>
              <p className="text-gray-700 mb-1"><span className="font-medium">Quantity:</span> {booking.quantity}</p>
              <p className="text-gray-700 mb-1"><span className="font-medium">Total Price:</span> ${booking.totalPrice.toFixed(2)}</p>
              <p className="text-gray-700 mb-3"><span className="font-medium">Status:</span> <span className={`font-bold px-3 py-1 rounded-full text-sm ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{booking.status.toUpperCase()}</span></p>
              <p className="text-gray-600 text-sm mb-1">Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              {booking.travelStart && <p className="text-gray-600 text-sm mb-1">Travel Start: {new Date(booking.travelStart).toLocaleDateString()}</p>}
              {booking.travelEnd && <p className="text-gray-600 text-sm mb-1">Travel End: {new Date(booking.travelEnd).toLocaleDateString()}</p>}
              {booking.notes && <p className="text-gray-600 text-sm italic mt-2">Notes: {booking.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
