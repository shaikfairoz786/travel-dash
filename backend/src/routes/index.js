const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const packageRoutes = require('./packages');
const bookingRoutes = require('./bookings');
const reviewRoutes = require('./reviews');
const adminRoutes = require('./admin');
const contactRoutes = require('./contacts');

// Mount routes with API versioning
router.use('/auth', authRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes); // Standalone reviews endpoint for user reviews
router.use('/admin', adminRoutes);
router.use('/contacts', contactRoutes);

// Mount reviews as nested routes under packages
router.use('/packages/:packageId/reviews', reviewRoutes);

module.exports = router;
