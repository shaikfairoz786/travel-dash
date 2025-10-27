import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 space-y-4 shadow-lg flex flex-col">
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">Admin Panel</h2>
      <nav className="flex-1">
        <Link to="/admin" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/admin')}`}>
          Dashboard
        </Link>
        <Link to="/admin/bookings" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/admin/bookings')}`}>
          Bookings
        </Link>
        <Link to="/admin/customers" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/admin/customers')}`}>
          Customers
        </Link>
        <Link to="/admin/packages" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/admin/packages')}`}>
          Packages
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} Travel Dash</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
