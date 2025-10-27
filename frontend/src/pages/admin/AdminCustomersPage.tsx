import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  bookings: any[]; // TODO: Define proper Booking interface
  reviews: any[]; // TODO: Define proper Review interface
}

const AdminCustomersPage: React.FC = () => {
  const { accessToken } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!accessToken) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/customers', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data.customers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [accessToken]);

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading customers...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Customers</h1>
      {customers.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No customers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.bookings.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.reviews.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
