import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import useAuth from '../hooks/useAuth';

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  overview?: string;
  itinerary?: Record<string, unknown>;
  inclusions?: Record<string, unknown>;
  exclusions?: Record<string, unknown>;
  price: number;
  currency: string;
  images?: {
    main?: string;
    gallery?: string[];
  };
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    name: string;
  };
}

const PackageDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { session } = useAuth();
  const accessToken = session?.access_token;
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/packages/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPackageData(data.package);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [slug]);

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    // Booking successful - modal will close automatically
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-secondary-700">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  if (!packageData) {
    return <div className="text-center mt-10 text-xl font-semibold">Package not found</div>;
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-8">
      <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{packageData.title}</h1>
          {packageData.images && packageData.images.main && (
            <div className="relative">
              <img src={`http://localhost:5000${packageData.images.main}`} alt={packageData.title} className="w-full h-96 object-cover rounded-xl mb-6" />
              {packageData.averageRating && packageData.averageRating > 0 && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center shadow-lg">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    {packageData.averageRating.toFixed(1)} ({packageData.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
          )}

          {packageData.images && packageData.images.gallery && packageData.images.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {packageData.images.gallery.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:5000${image}`}
                  alt={`${packageData.title} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {packageData.overview && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{packageData.overview}</p>
            </div>
          )}

          {packageData.itinerary && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Itinerary</h2>
              <div className="bg-primary-50 p-6 rounded-xl">
                {Array.isArray(packageData.itinerary) ? (
                  <div className="space-y-4">
                    {packageData.itinerary.map((day: string, index: number) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-800">Day {index + 1}</h3>
                        <p className="text-gray-600 mt-1">{day}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(packageData.itinerary, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {packageData.inclusions && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inclusions</h2>
              <div className="bg-primary-50 p-6 rounded-xl">
                {Array.isArray(packageData.inclusions) ? (
                  <ul className="space-y-2">
                    {packageData.inclusions.map((item: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(packageData.inclusions, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {packageData.exclusions && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exclusions</h2>
              <div className="bg-primary-50 p-6 rounded-xl">
                {Array.isArray(packageData.exclusions) ? (
                  <ul className="space-y-2">
                    {packageData.exclusions.map((item: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(packageData.exclusions, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {packageData.reviews && packageData.reviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
              <div className="space-y-4">
                {packageData.reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{review.customer.name}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-gray-600">{review.comment}</p>}
                    <p className="text-sm text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Book This Package</h3>
            <p className="text-gray-600 mb-4">{packageData.shortDesc}</p>
            <div className="text-3xl font-bold text-primary-600 mb-6">
              {packageData.currency} {packageData.price.toFixed(2)}
            </div>
            {accessToken ? (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-300 font-semibold"
              >
                Book Now
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please login to book this package</p>
                <a href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          packageId={packageData.id}
          packageName={packageData.title}
          price={packageData.price}
          onClose={() => setIsBookingModalOpen(false)}
          onBook={handleBookingSuccess}
        />
      )}
      </div>
    </div>
  );
};

export default PackageDetailsPage;
