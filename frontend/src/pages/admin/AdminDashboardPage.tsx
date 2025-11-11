 import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from "../../config/api";

interface MetricsOverview {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  activePackages: number;
}

interface BookingTrendData {
  month: string;
  count: number;
}

interface RevenueTrendData {
  month: string;
  revenue: number;
}

interface TopPackageData {
  packageId: string;
  packageTitle: string;
  packageSlug: string;
  bookingCount: number;
  totalRevenue: number;
  averagePrice: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B5B95', '#88B04B'];

const AdminDashboardPage: React.FC = () => {
  const { session, user } = useAuth();
  const [overview, setOverview] = useState<MetricsOverview | null>(null);
  const [trends, setTrends] = useState<{ bookingsPerMonth: BookingTrendData[]; revenueTrend: RevenueTrendData[]; topPackages: TopPackageData[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      console.log('Fetching metrics...');

      // Use the same token for both admin and customer users
      const token = session?.access_token;

      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        console.error('Not authenticated');
        return;
      }

      console.log('Using token for request:', token.substring(0, 50) + '...');

      try {
        const overviewResponse = await fetch(`${API_BASE_URL}/api/admin/dashboard/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const trendsResponse = await fetch(`${API_BASE_URL}/api/admin/dashboard/trends`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('overviewResponse:', overviewResponse);
        console.log('trendsResponse:', trendsResponse);

        if (!overviewResponse.ok || !trendsResponse.ok) {
          throw new Error(`HTTP error! status: ${overviewResponse.status} ${trendsResponse.status}`);
        }

        const overviewData = await overviewResponse.json();
        const trendsData = await trendsResponse.json();

        console.log('overviewData:', overviewData);
        console.log('trendsData:', trendsData);

        setOverview(overviewData.overview || overviewData);
        setTrends(trendsData);
      } catch (err: unknown) {
        console.error('Error fetching metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user || session) {
      fetchMetrics();
    }
  }, [user, session]);

  console.log('Render state:', { loading, error, overview, trends });

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  const formatChartData = (data: unknown[], key: string, valueKey: string) => {
    const monthlyData: Record<string, number> = {};
    if (data) {
      data.forEach(item => {
        const itemObj = item as Record<string, unknown>;
        const month = itemObj[key] as string;
        const value = itemObj[valueKey] as number;
        if (typeof value === 'number') {
          monthlyData[month] = (monthlyData[month] || 0) + value;
        }
      });
    }
    const dataKey = valueKey.replace('.', '_');
    return Object.keys(monthlyData).sort().map(month => ({
      name: month,
      [dataKey]: monthlyData[month],
    }));
  };

  const bookingsChartData = trends ? formatChartData(trends.bookingsPerMonth, 'month', 'count') : [];
  const revenueChartData = trends ? formatChartData(trends.revenueTrend, 'month', 'revenue') : [];
  const topPackagesChartData = trends ? trends.topPackages.map(pkg => ({ name: pkg.packageTitle, value: pkg.bookingCount })) : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Revenue</h2>
            <p className="text-4xl font-extrabold text-indigo-600">${overview.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Bookings</h2>
            <p className="text-4xl font-extrabold text-indigo-600">{overview.totalBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Customers</h2>
            <p className="text-4xl font-extrabold text-indigo-600">{overview.totalCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Active Packages</h2>
            <p className="text-4xl font-extrabold text-indigo-600">{overview.activePackages}</p>
          </div>
        </div>
      )}

      {trends && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Bookings Per Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Packages by Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topPackagesChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {topPackagesChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
