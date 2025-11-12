import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const GlobalNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-soft border-b border-secondary-200 sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            <img src="https://drive.google.com/file/d/1ko-2vOh8nnBbplob2HNYsXqrIC4gVcRp/view?usp=drive_link" alt="Travores Logo" className="h-14 w-14 rounded-full object-cover" />
            <span>Travores</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about-us" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                    Admin Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {user.role === 'customer' && (
                  <>
                    <Link to="/my-bookings" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                      My Bookings
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/my-reviews" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                      My Reviews
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-secondary-700 font-medium">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-secondary-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors duration-300 p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-light rounded-lg mt-2 border border-secondary-200">
              <Link to="/" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                Home
              </Link>
              <Link to="/about-us" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                About Us
              </Link>
              <Link to="/contact" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                Contact
              </Link>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'customer' && (
                    <>
                      <Link to="/my-bookings" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                        My Bookings
                      </Link>
                      <Link to="/my-reviews" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                        My Reviews
                      </Link>
                    </>
                  )}
                  <div className="px-3 py-3 text-secondary-700 font-medium border-t border-secondary-200 mt-2 pt-3">
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-3 text-secondary-700 hover:text-primary-600 hover:bg-white transition-all duration-300 rounded-md font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-3 text-center bg-gradient-primary text-white hover:shadow-medium transition-all duration-300 rounded-md font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavbar;
