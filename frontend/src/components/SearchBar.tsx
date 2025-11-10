import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Navigate to packages page with search query
    if (destination.trim()) {
      navigate(`/packages?search=${encodeURIComponent(destination.trim())}`);
    } else {
      navigate('/packages');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-large p-2 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Destination */}
          <div className="relative">
            <label htmlFor="destination" className="block text-xs font-semibold text-secondary-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                id="destination"
                type="text"
                placeholder="Where to?"
                className="w-full pl-9 pr-3 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-secondary-900 placeholder-secondary-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="relative">
            <label htmlFor="guests" className="block text-xs font-semibold text-secondary-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <select
                id="guests"
                className="w-full pl-9 pr-3 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-secondary-900 appearance-none bg-white"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-medium flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Quick Search Options */}
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-600 mb-3">Popular destinations:</p>
          <div className="flex flex-wrap gap-2">
            {['Bali', 'Paris', 'Tokyo', 'New York', 'Dubai', 'London'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setDestination(city);
                }}
                className="px-3 py-1 bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
