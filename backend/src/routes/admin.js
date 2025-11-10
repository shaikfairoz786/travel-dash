const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply authentication and admin authorization to all admin routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Dashboard routes
router.get('/dashboard/overview', adminController.getMetricsOverview);
router.get('/dashboard/trends', adminController.getMetricsTrends);
router.get('/dashboard/recent-activity', adminController.getRecentActivity);
router.get('/dashboard/system-health', adminController.getSystemHealth);

// Customer management
router.get('/customers', adminController.getAllCustomers);

module.exports = router;
