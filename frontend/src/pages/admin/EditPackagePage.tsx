import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  overview?: string;
  price: number;
  currency: string;
  active: boolean;
  images?: {
    main: string;
    gallery: string[];
  };
  duration?: string;
  location?: string;
  maxGroupSize?: number;
  difficulty?: string;
  highlights?: string[];
  itinerary?: string[];
  inclusions?: string[];
  exclusions?: string[];
}

const EditPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const accessToken = session?.access_token;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    overview: '',
    price: '',
    currency: 'INR',
    active: true,
    images: '',
    duration: '',
    location: '',
    maxGroupSize: '',
    difficulty: 'Easy',
    highlights: '',
    itinerary: '',
    inclusions: '',
    exclusions: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mainImage, setMainImage] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackage();
  }, [id, accessToken]);

  const fetchPackage = async () => {
    if (!accessToken || !id) {
      setError('Not authenticated or invalid package ID');
      setFetchLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/packages/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const pkg: Package = data.package;

      setFormData({
        title: pkg.title || '',
        slug: pkg.slug || '',
        shortDesc: pkg.shortDesc || '',
        overview: pkg.overview || '',
        price: pkg.price?.toString() || '',
        currency: pkg.currency || 'INR',
        active: pkg.active ?? true,
        images: pkg.images ? [pkg.images.main, ...(pkg.images.gallery || [])].join('\n') : '',
        duration: pkg.duration || '',
        location: pkg.location || '',
        maxGroupSize: pkg.maxGroupSize?.toString() || '',
        difficulty: pkg.difficulty || 'Easy',
        highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '',
        itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary.join('\n') : '',
        inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '',
        exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken || !id) {
      setError('Not authenticated or invalid package ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      if (formData.shortDesc) formDataToSend.append('shortDesc', formData.shortDesc);
      if (formData.overview) formDataToSend.append('overview', formData.overview);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('active', formData.active.toString());
      if (formData.duration) formDataToSend.append('duration', formData.duration);
      if (formData.location) formDataToSend.append('location', formData.location);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('highlights', JSON.stringify(formData.highlights.split('\n').filter(item => item.trim())));
      formDataToSend.append('itinerary', JSON.stringify(formData.itinerary.split('\n').filter(item => item.trim())));
      formDataToSend.append('inclusions', JSON.stringify(formData.inclusions.split('\n').filter(item => item.trim())));
      formDataToSend.append('exclusions', JSON.stringify(formData.exclusions.split('\n').filter(item => item.trim())));
      // Only send images if they have been modified or if there are new images
      if (formData.images.trim()) {
        formDataToSend.append('images', formData.images);
      }

      // Only include maxGroupSize if it's provided and valid
      if (formData.maxGroupSize.trim() && !isNaN(parseInt(formData.maxGroupSize))) {
        formDataToSend.append('maxGroupSize', formData.maxGroupSize);
      }

      // Append files
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage);
      }
      galleryImages.forEach((file) => {
        formDataToSend.append('galleryImages', file);
      });

      console.log('FormData being sent:', formDataToSend);

      const response = await fetch(`http://localhost:5000/api/packages/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Package updated successfully!');
      navigate('/admin/packages');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading package...</div>;
  }

  if (error && fetchLoading === false) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Edit Package</h1>
        <button
          onClick={() => navigate('/admin/packages')}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Packages
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Package title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="package-slug"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              id="shortDesc"
              name="shortDesc"
              rows={3}
              value={formData.shortDesc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief description of the package"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-2">
              Overview
            </label>
            <textarea
              id="overview"
              name="overview"
              rows={5}
              value={formData.overview}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Detailed overview of the package"
            />
          </div>

          {/* Pricing */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pricing</h2>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              id="currency"
              name="currency"
              required
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          {/* Package Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Details</h2>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 7 Days 6 Nights"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Paris, France"
            />
          </div>

          <div>
            <label htmlFor="maxGroupSize" className="block text-sm font-medium text-gray-700 mb-2">
              Max Group Size
            </label>
            <input
              type="number"
              id="maxGroupSize"
              name="maxGroupSize"
              min="1"
              value={formData.maxGroupSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>

          {/* Image Uploads */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image Uploads</h2>
          </div>

          <div>
            <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
              Main Image
            </label>
            <input
              type="file"
              id="mainImage"
              name="mainImage"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images (multiple)
            </label>
            <input
              type="file"
              id="galleryImages"
              name="galleryImages"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Current Images (one per line)
            </label>
            <textarea
              id="images"
              name="images"
              rows={3}
              value={formData.images}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Active (visible to customers)
            </label>
          </div>

          {/* Additional Information */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Information</h2>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
              Highlights (one per line)
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={4}
              value={formData.highlights}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Visit Eiffel Tower&#10;Seine River Cruise&#10;Montmartre District"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="itinerary" className="block text-sm font-medium text-gray-700 mb-2">
              Itinerary (one item per line)
            </label>
            <textarea
              id="itinerary"
              name="itinerary"
              rows={6}
              value={formData.itinerary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Day 1: Arrival and hotel check-in&#10;Day 2: Eiffel Tower visit&#10;Day 3: Louvre Museum"
            />
          </div>

          <div>
            <label htmlFor="inclusions" className="block text-sm font-medium text-gray-700 mb-2">
              What's Included (one per line)
            </label>
            <textarea
              id="inclusions"
              name="inclusions"
              rows={4}
              value={formData.inclusions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Hotel accommodation&#10;Breakfast&#10;Airport transfers"
            />
          </div>

          <div>
            <label htmlFor="exclusions" className="block text-sm font-medium text-gray-700 mb-2">
              What's Excluded (one per line)
            </label>
            <textarea
              id="exclusions"
              name="exclusions"
              rows={4}
              value={formData.exclusions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="International flights&#10;Personal expenses&#10;Travel insurance"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/packages')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPackagePage;
