import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  package: {
    id: string;
    title: string;
    slug: string;
    images?: {
      main?: string;
    };
  };
}

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');
  const [editHoverRating, setEditHoverRating] = useState<number>(0);
  const [updating, setUpdating] = useState<boolean>(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchReviews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/reviews/user/my?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Refresh reviews
      fetchReviews(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment('');
    setEditHoverRating(0);
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (editRating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!editComment.trim()) {
      alert('Please write a comment');
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      // Refresh reviews and reset edit state
      fetchReviews(currentPage);
      handleCancelEdit();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setUpdating(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-secondary-700">Loading your reviews...</p>
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
          <button
            className="btn-primary"
            onClick={() => fetchReviews(currentPage)}
          >
            Try Again
          </button>
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
            My Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View and manage all the reviews you've written for our travel packages.
          </p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📝</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No reviews yet</h3>
            <p className="text-gray-600 mb-8 text-lg">
              You haven't written any reviews yet. Complete a booking and share your experience!
            </p>
            <Link to="/packages" className="btn-primary text-lg px-8 py-3">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6">
                    {editingReview === review.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Edit Review</h3>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating *
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="focus:outline-none"
                                onMouseEnter={() => setEditHoverRating(star)}
                                onMouseLeave={() => setEditHoverRating(0)}
                                onClick={() => setEditRating(star)}
                              >
                                {star <= (editHoverRating || editRating) ? (
                                  <StarIconSolid className="h-6 w-6 text-yellow-400" />
                                ) : (
                                  <StarIcon className="h-6 w-6 text-gray-300" />
                                )}
                              </button>
                            ))}
                            <span className="ml-3 text-sm text-gray-600">
                              {editRating > 0 && `${editRating} star${editRating !== 1 ? 's' : ''}`}
                            </span>
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label htmlFor={`edit-comment-${review.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review *
                          </label>
                          <textarea
                            id={`edit-comment-${review.id}`}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            placeholder="Share your experience with this travel package..."
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {editComment.length}/500 characters
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleUpdateReview(review.id)}
                            disabled={updating}
                            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-semibold"
                          >
                            {updating ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Updating...
                              </div>
                            ) : (
                              'Update Review'
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          {review.package.images?.main && (
                            <div className="flex-shrink-0">
                              <img
                                src={`http://localhost:5000${review.package.images.main}`}
                                alt={review.package.title}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/package/${review.package.slug}`}
                              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors duration-300 line-clamp-1"
                            >
                              {review.package.title}
                            </Link>
                            <div className="flex items-center mt-2 mb-3">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                {review.rating}/5
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-300 rounded-lg hover:bg-primary-50"
                            title="Edit review"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300 rounded-lg hover:bg-red-50"
                            title="Delete review"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
