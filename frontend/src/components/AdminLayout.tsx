import React, { type ReactNode } from 'react';
import AdminSidebar from './AdminSidebar'; // Will create this next

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
