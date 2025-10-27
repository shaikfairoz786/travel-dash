import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, GlobeAltIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import SearchBar from '../components/SearchBar';
import WhyChooseUs from '../components/WhyChooseUs';
import WhatOurTravelersSay from '../components/WhatOurTravelersSay';

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  price: number;
  currency: string;
  images?: {
    main?: string;
  };
  averageRating?: number;
  reviewCount?: number;
}

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const query = searchTerm ? `?search=${searchTerm}` : '';
        const response = await fetch(`http://localhost:5000/api/packages${query}`);
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

    fetchPackages();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-secondary-700">Loading amazing destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-secondary-600 mb-6">We're working to fix this. Please try again later.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-light overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="hero-text mb-6 animate-slide-up">
              Discover Your Next
              <span className="block bg-gradient-primary bg-clip-text text-transparent">Adventure</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Explore breathtaking destinations and create unforgettable memories with our curated travel packages.
              Your journey to extraordinary experiences starts here.
            </p>
            <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <SearchBar onSearch={setSearchTerm} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-secondary-600 font-medium">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div className="text-secondary-600 font-medium">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
                <div className="text-secondary-600 font-medium">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-secondary-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <GlobeAltIcon className="h-12 w-12 text-primary-300" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <MapPinIcon className="h-12 w-12 text-accent-300" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-in-left">
              <div className="bg-gradient-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Secure Bookings</h3>
              <p className="text-secondary-600">Your safety and security are our top priorities with encrypted transactions.</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">24/7 Support</h3>
              <p className="text-secondary-600">Round-the-clock customer support for all your travel needs and emergencies.</p>
            </div>
            <div className="text-center animate-slide-in-right">
              <div className="bg-gradient-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Best Experiences</h3>
              <p className="text-secondary-600">Curated experiences and packages designed for unforgettable adventures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gradient-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-title">Explore Our Destinations</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover handpicked destinations that offer the perfect blend of adventure, culture, and relaxation.
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏖️</div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">No packages found</h3>
              <p className="text-secondary-600 mb-6">Try adjusting your search criteria or check back later for new destinations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 6).map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="card group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {pkg.images && pkg.images.main && (
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={pkg.images.main}
                        alt={pkg.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-soft">
                        Featured
                      </div>
                      {pkg.averageRating && (
                        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-soft">
                          <StarIcon className="h-4 w-4 text-accent-500 mr-1" />
                          <span className="text-sm font-semibold text-secondary-900">
                            {pkg.averageRating.toFixed(1)} ({pkg.reviewCount || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300">
                        {pkg.title}
                      </h3>
                    </div>
                    <p className="text-secondary-600 text-base mb-4 line-clamp-3">{pkg.shortDesc}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-primary-700">
                          {pkg.currency} {pkg.price.toFixed(2)}
                        </span>
                        <p className="text-sm text-secondary-500">per person</p>
                      </div>
                      <Link to={`/package/${pkg.slug}`}>
                        <button className="btn-primary">
                          Explore
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {packages.length > 6 && (
            <div className="text-center mt-12 animate-fade-in">
              <button className="btn-secondary">
                View All Destinations
              </button>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <WhatOurTravelersSay />
    </div>
  );
};

export default HomePage;
