import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from "../../config/api";

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  price: number;
  currency: string;
  active: boolean;
  images?: string[];
  createdAt: string;
}

const AdminPackagesPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const accessToken = session?.access_token;
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    if (!accessToken) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/admin/all`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPackages(data.packages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [accessToken]);

  const handleDelete = async (packageId: string) => {
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/admin/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Package deleted successfully!');
      fetchPackages(); // Refresh the list
    } catch (err: unknown) {
      alert(`Failed to delete package: ${err instanceof Error ? err.message : 'An error occurred'}`);
    }
  };

  const handleToggleActive = async (packageId: string, currentStatus: boolean) => {
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/admin/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Package status updated successfully!');
      fetchPackages(); // Refresh the list
    } catch (err: unknown) {
      alert(`Failed to update package status: ${err instanceof Error ? err.message : 'An error occurred'}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading packages...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Packages</h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/admin/packages/add')}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg font-medium"
        >
          Add New Package
        </button>
      </div>
      {packages.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No packages found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pkg.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pkg.currency} {pkg.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pkg.images ? pkg.images.length : 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {pkg.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(pkg.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/packages/edit/${pkg.id}`)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(pkg.id, pkg.active)}
                        className={`px-3 py-1 rounded-md text-xs transition duration-200 ${pkg.active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                      >
                        {pkg.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPackagesPage;
