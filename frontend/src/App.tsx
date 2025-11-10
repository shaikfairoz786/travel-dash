import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AllPackagesPage from './pages/AllPackagesPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyReviewsPage from './pages/MyReviewsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import GlobalNavbar from './components/GlobalNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AddPackagePage from './pages/admin/AddPackagePage';
import EditPackagePage from './pages/admin/EditPackagePage';
import AdminContactsPage from './pages/admin/AdminContactsPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalNavbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/packages" element={<AllPackagesPage />} />
          <Route path="/package/:slug" element={<PackageDetailsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes (Customer) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-reviews" element={<MyReviewsPage />} />
            {/* Add other customer protected routes here */}
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div key={location.pathname}><AdminLayout><AdminDashboardPage /></AdminLayout></div>} />
            <Route path="/admin/dashboard" element={<div key={location.pathname}><AdminLayout><AdminDashboardPage /></AdminLayout></div>} />
            <Route path="/admin/bookings" element={<div key={location.pathname}><AdminLayout><AdminBookingsPage /></AdminLayout></div>} />
            <Route path="/admin/customers" element={<div key={location.pathname}><AdminLayout><AdminCustomersPage /></AdminLayout></div>} />
            <Route path="/admin/packages" element={<div key={location.pathname}><AdminLayout><AdminPackagesPage /></AdminLayout></div>} />
            <Route path="/admin/packages/add" element={<div key={location.pathname}><AdminLayout><AddPackagePage /></AdminLayout></div>} />
            <Route path="/admin/packages/edit/:id" element={<div key={location.pathname}><AdminLayout><EditPackagePage /></AdminLayout></div>} />
            <Route path="/admin/contacts" element={<div key={location.pathname}><AdminLayout><AdminContactsPage /></AdminLayout></div>} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
