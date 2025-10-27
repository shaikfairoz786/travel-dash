const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Import booking controller
const bookingController = require('../controllers/bookingController');

// Create a new booking (customer only)
router.post('/', authenticateToken, authorizeRoles('customer'), bookingController.createBooking);

// Get authenticated customer's bookings (customer only)
router.get('/my', authenticateToken, authorizeRoles('customer'), bookingController.getMyBookings);

// Get all bookings (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), bookingController.getAllBookings);

// Get booking statistics (admin only)
router.get('/stats/overview', authenticateToken, authorizeRoles('admin'), bookingController.getBookingStats);

// Get a single booking by ID (admin or booking owner)
router.get('/:id', authenticateToken, bookingController.getBookingById);

// Update booking status (admin only)
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), bookingController.updateBookingStatus);

module.exports = router;
