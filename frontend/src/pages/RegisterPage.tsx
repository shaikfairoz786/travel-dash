import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserPlusIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    await register(name, email, phone, password);
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-300 mb-6">
            <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-glow animate-float">
              <UserPlusIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-3">
            Join Travores
          </h1>
          <p className="text-lg text-secondary-600">
            Create your account and start your adventure
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-large p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-secondary-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input-field"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-secondary-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-secondary-900 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="input-field"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-500 hover:text-primary-600 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckIcon className={`h-4 w-4 mr-2 ${req.met ? 'text-accent-500' : 'text-secondary-400'}`} />
                      <span className={req.met ? 'text-secondary-700' : 'text-secondary-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-secondary-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-500 hover:text-primary-600 transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-secondary-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-lg font-semibold py-4 rounded-xl shadow-medium hover:shadow-large transform hover:scale-[1.02] transition-all duration-300"
              disabled={!agreeToTerms || password !== confirmPassword}
            >
              Create Your Account
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-secondary-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-secondary-300 rounded-lg shadow-soft bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-secondary-300 rounded-lg shadow-soft bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-secondary-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-secondary-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors duration-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
{/* <environment_details>
# VSCode Visible Files
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/0
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/1
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/2
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/0
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/1
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/2
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/0
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/1
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/2
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/3
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/4
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/0
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/1
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/2
travel-dash/frontend/src/pages/RegisterPage.tsx

# VSCode Visible Files
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/0
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/1
../../response_b0e62dc5-a83d-4dcb-baec-0caea45c34d2/2
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/0
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/1
../../response_215201a1-cf0d-417b-8148-4dcbdfd5959d/2
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/0
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/1
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/2
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/3
../../response_5f690271-39ee-4537-9db2-b599fa3faa9e/4
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/0
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/1
../../response_8cc7b388-e072-43a5-af8b-206cc3db3c61/2
travel-dash/frontend/src/pages/RegisterPage.tsx

# VSCode Open Tabs
travel-dash/frontend/tsconfig.app.json
travel-dash/frontend/postcss.config.cjs
travel-dash/backend/src/routes/auth.js
travel-dash/backend/src/utils/prisma.js
travel-dash/backend/src/middleware/errorHandler.js
travel-dash/backend/src/controllers/bookingController.js
travel-dash/backend/src/controllers/reviewController.js
travel-dash/backend/src/routes/bookings.js
travel-dash/backend/src/routes/reviews.js
travel-dash/backend/src/routes/index.js
travel-dash/frontend/src/pages/admin/AdminPackagesPage.tsx
travel-dash/backend/src/middleware/upload.js
travel-dash/backend/public/uploads/galleryImages-1762518201949-166007214.jpg
travel-dash/backend/public/uploads/mainImage-1762517642713-492287.webp
travel-dash/backend/public/uploads/mainImage-1762518201937-145497171.jpg
travel-dash/frontend/src/pages/admin/EditPackagePage.tsx
travel-dash/backend/server.js
travel-dash/backend/response.txt
travel-dash/backend/src/utils/validation.js
travel-dash/frontend/src/pages/AboutUsPage.tsx
travel-dash/frontend/src/pages/ContactPage.tsx
travel-dash/frontend/tailwind.config.js
travel-dash/frontend/src/components/AdminLayout.tsx
travel-dash/frontend/src/components/AdminSidebar.tsx
travel-dash/frontend/src/pages/AllPackagesPage.tsx
travel-dash/frontend/src/pages/PackageDetailsPage.tsx
travel-dash/frontend/src/components/BookingModal.tsx
travel-dash/frontend/src/pages/HomePage.tsx
travel-dash/frontend/src/components/GlobalNavbar.tsx
travel-dash/frontend/src/components/Footer.tsx
travel-dash/frontend/src/pages/LoginPage.tsx
travel-dash/frontend/src/pages/RegisterPage.tsx
travel-dash/frontend/src/App.tsx
travel-dash/backend/src/routes/packages.js
travel-dash/frontend/src/pages/admin/AddPackagePage.tsx
travel-dash/backend/src/middleware/auth.js
travel-dash/backend/src/controllers/adminController.js
travel-dash/frontend/src/index.css
travel-dash/backend/prisma/schema.prisma
travel-dash/TODO.md
travel-dash/backend/prisma/seed.js
travel-dash/backend/src/controllers/userController.js
travel-dash/frontend/src/context/AuthContext.tsx
travel-dash/frontend/src/pages/admin/AdminDashboardPage.tsx
travel-dash/frontend/src/pages/admin/AdminCustomersPage.tsx
travel-dash/frontend/src/pages/admin/AdminBookingsPage.tsx
travel-dash/frontend/src/pages/MyBookingsPage.tsx
travel-dash/backend/src/routes/admin.js
travel-dash/frontend/src/hooks/useAuth.ts
travel-dash/backend/scripts/delete_user.sql
travel-dash/frontend/src/main.tsx

# Actively Running Terminals
## Original command: `cd travel-dash/frontend && npm run dev`
</environment_details> */}
