const express = require('express');
const router = express.Router({ mergeParams: true });
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Import review controller
const reviewController = require('../controllers/reviewController');

// Get all reviews for a package (public)
router.get('/', reviewController.getPackageReviews);

// Create a new review (customer only)
router.post('/', authenticateToken, authorizeRoles('customer'), reviewController.createReview);

// Update a review (review owner only)
router.put('/:reviewId', authenticateToken, reviewController.updateReview);

// Delete a review (review owner or admin)
router.delete('/:reviewId', authenticateToken, reviewController.deleteReview);

// Get authenticated user's reviews (customer only)
router.get('/user/my', authenticateToken, authorizeRoles('customer'), reviewController.getMyReviews);

module.exports = router;
