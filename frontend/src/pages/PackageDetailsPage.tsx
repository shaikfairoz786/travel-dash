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
  itinerary?: any;
  inclusions?: any;
  price: number;
  currency: string;
  images?: any;
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
  const { accessToken } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/packages/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPackageData(data.package);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [slug]);

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    // Optionally refresh package data or show success message
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading package details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  if (!packageData) {
    return <div className="text-center mt-10 text-xl font-semibold">Package not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{packageData.title}</h1>
          {packageData.images && packageData.images.main && (
            <img src={packageData.images.main} alt={packageData.title} className="w-full h-96 object-cover rounded-xl mb-6" />
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
              <div className="bg-gray-50 p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(packageData.itinerary, null, 2)}</pre>
              </div>
            </div>
          )}

          {packageData.inclusions && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inclusions</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(packageData.inclusions, null, 2)}</pre>
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
            <div className="text-3xl font-bold text-indigo-600 mb-6">
              {packageData.currency} {packageData.price.toFixed(2)}
            </div>
            {accessToken ? (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold"
              >
                Book Now
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please login to book this package</p>
                <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
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
  );
};

export default PackageDetailsPage;
