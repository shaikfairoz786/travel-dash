import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import GlobalNavbar from './components/GlobalNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalNavbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/package/:slug" element={<PackageDetailsPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes (Customer) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            {/* Add other customer protected routes here */}
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/bookings" element={<AdminLayout><AdminBookingsPage /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
            <Route path="/admin/packages" element={<AdminLayout><AdminPackagesPage /></AdminLayout>} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
