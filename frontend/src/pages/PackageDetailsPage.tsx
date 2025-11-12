import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingModal from "../components/BookingModal";
import useAuth from "../hooks/useAuth";
import { API_BASE_URL } from "../config/api";
import placeholder from "/default-placeholder.jpg"; // ✅ always available

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  overview?: string;
  itinerary?: string[];
  inclusions?: string[];
  exclusions?: string[];
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // ✅ Unified Image Resolver
  const getImageUrl = (url?: string): string => {
    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    const cleanBase = API_BASE_URL.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\/+/, "");

    return `${cleanBase}/${cleanUrl}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/packages/${slug}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPackageData(data.package);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [slug]);

  const handleBookingSuccess = () => setIsBookingModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-secondary-700">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-xl font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Package not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-8">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== Left Content ===== */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {packageData.title}
            </h1>

            {/* ===== Main Image ===== */}
            <div className="relative">
              <img
                src={getImageUrl(packageData.images?.main)}
                alt={packageData.title}
                className="w-full h-96 object-cover rounded-xl mb-6"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.src = placeholder;
                    target.dataset.fallback = "true";
                  }
                }}
              />
              {packageData.averageRating && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-full flex items-center shadow-md">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    {packageData.averageRating.toFixed(1)} (
                    {packageData.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>

            {/* ===== Gallery ===== */}
            {packageData.images?.gallery?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {packageData.images.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${packageData.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.src = placeholder;
                        target.dataset.fallback = "true";
                      }
                    }}
                  />
                ))}
              </div>
            ) : null}

            {/* ===== Overview ===== */}
            {packageData.overview && (
              <Section title="Overview">
                <p className="text-gray-600 leading-relaxed">
                  {packageData.overview}
                </p>
              </Section>
            )}

            {/* ===== Itinerary ===== */}
            {packageData.itinerary && (
              <Section title="Itinerary">
                {Array.isArray(packageData.itinerary) ? (
                  <div className="space-y-4">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-800">
                          Day {index + 1}
                        </h3>
                        <p className="text-gray-600 mt-1">{day}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {JSON.stringify(packageData.itinerary, null, 2)}
                  </pre>
                )}
              </Section>
            )}

            {/* ===== Inclusions ===== */}
            {packageData.inclusions && (
              <Section title="Inclusions">
                <List items={packageData.inclusions} color="green" />
              </Section>
            )}

            {/* ===== Exclusions ===== */}
            {packageData.exclusions && (
              <Section title="Exclusions">
                <List items={packageData.exclusions} color="red" />
              </Section>
            )}

            {/* ===== Reviews ===== */}
            {packageData.reviews?.length ? (
              <Section title="Reviews">
                <div className="space-y-4">
                  {packageData.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {review.customer.name}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}
          </div>

          {/* ===== Right Sidebar ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Book This Package
              </h3>
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
                  <p className="text-gray-600 mb-4">
                    Please login to book this package
                  </p>
                  <a
                    href="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
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

/* ===== Helper Components ===== */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="bg-white p-6 rounded-xl shadow-sm">{children}</div>
  </div>
);

const List: React.FC<{ items: string[]; color: "green" | "red" }> = ({
  items,
  color,
}) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-center">
        <svg
          className={`w-5 h-5 mr-3 ${
            color === "green" ? "text-green-500" : "text-red-500"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d={
              color === "green"
                ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            }
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
);
