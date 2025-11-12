import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from "../config/api";

const placeholder = "/default-placeholder.jpg";

// ✅ Safe image URL generator
const getImageUrl = (url?: string): string => {
  if (!url) return placeholder;
  if (url.startsWith("http")) return url;

  const cleanBase = API_BASE_URL.replace(/\/$/, "");
  const cleanUrl = url.replace(/^\/+/, "");

  return `${cleanBase}/${cleanUrl}`;
};


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
  duration?: string;
  location?: string;
  difficulty?: string;
  highlights?: string[];
  createdAt?: string;
}

interface FilterState {
  search: string;
  location: string;
  difficulty: string;
  priceRange: string;
  sortBy: string;
}

const AllPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    difficulty: '',
    priceRange: '',
    sortBy: 'featured'
  });

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam }));
    }
  }, []);

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch packages from API
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '100'); // Fetch more packages for client-side filtering

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      // Only send sortBy if it's supported by backend
      if (filters.sortBy && ['price-low', 'price-high', 'rating-high', 'newest', 'oldest'].includes(filters.sortBy)) {
        params.append('sortBy', filters.sortBy);
      }

      const response = await fetch(`${API_BASE_URL}/api/packages?${params.toString()}`);
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
  }, [filters.sortBy, debouncedSearch]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Memoized filtered and sorted packages
  const filteredPackages = useMemo(() => {
    let filtered = packages;

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(pkg => pkg.location === filters.location);
    }

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter(pkg => pkg.difficulty === filters.difficulty);
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(pkg => {
        const price = pkg.price;
        switch (filters.priceRange) {
          case 'under-1000':
            return price < 1000;
          case '1000-5000':
            return price >= 1000 && price <= 5000;
          case '5000-10000':
            return price > 5000 && price <= 10000;
          case 'over-10000':
            return price > 10000;
          default:
            return true;
        }
      });
    }

    // Sort packages (client-side sorting for featured and additional sorts)
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
        case 'rating-high':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'newest':
          // Assuming packages have createdAt, sort by newest first
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          // Assuming packages have createdAt, sort by oldest first
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'featured':
        default:
          return 0; // Keep original order for featured
      }
    });

    return filtered;
  }, [packages, filters]);

  // Memoized filter options
  const filterOptions = useMemo(() => ({
    locations: [...new Set(packages.map(pkg => pkg.location).filter(Boolean))].sort(),
    difficulties: [...new Set(packages.map(pkg => pkg.difficulty).filter(Boolean))].sort()
  }), [packages]);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      location: '',
      difficulty: '',
      priceRange: '',
      sortBy: 'featured'
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== 'featured');
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-secondary-700">Discovering amazing destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-secondary-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              className="btn-secondary"
              onClick={() => setError(null)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            All Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our complete collection of travel packages. Use our advanced filters to find your perfect adventure.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 mb-8 border border-gray-200/50 backdrop-blur-sm">
          {/* Hero Search Section */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Find Your Perfect Adventure</h2>
            <p className="text-gray-600 text-sm mb-4">Discover amazing destinations with our advanced search and filters</p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations, locations, or activities..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="block w-full pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                    showFilters
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200'
                  }`}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  {hasActiveFilters && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      !
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm border border-red-200"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <MapPinIcon className="h-4 w-4 text-primary-600" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Locations</option>
                    {filterOptions.locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Difficulty Level
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => updateFilter('difficulty', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Levels</option>
                    {filterOptions.difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => updateFilter('priceRange', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Prices</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="over-10000">Over $10,000</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 font-medium">
            Showing {filteredPackages.length} of {packages.length} destinations
          </p>
          {hasActiveFilters && (
            <div className="text-sm text-primary-600">
              Filters applied
            </div>
          )}
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🏖️</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No packages found</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {hasActiveFilters
                ? "Try adjusting your search criteria or filters to find more options."
                : "We're working on adding more amazing destinations. Check back soon!"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-primary text-lg px-8 py-3"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.images && pkg.images.main && (
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(pkg.images?.main)}
                      alt={pkg.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.src = '/default-placeholder.jpg';
                          target.dataset.fallback = "true";
                        }
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Featured
                    </div>
                    {pkg.averageRating && pkg.averageRating > 0 && (
                      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center shadow-lg">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">
                          {pkg.averageRating.toFixed(1)} ({pkg.reviewCount || 0})
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1 min-w-0">
                      <MapPinIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {pkg.location && (
                    <p className="text-sm text-gray-500 mb-2 font-medium">{pkg.location}</p>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{pkg.shortDesc}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary-700">
                        {pkg.currency} {pkg.price.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    {pkg.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pkg.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        pkg.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        pkg.difficulty === 'Challenging' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pkg.difficulty}
                      </span>
                    )}
                  </div>

                  <Link to={`/package/${pkg.slug}`}>
                    <button className="w-full btn-primary py-3 text-base font-semibold">
                      Explore Destination
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPackagesPage;
