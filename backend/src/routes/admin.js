const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Get all customers with pagination (admin only)
router.get('/customers', authenticateToken, authorizeRoles('admin'), adminController.getAllCustomers);

// Get admin dashboard metrics overview (admin only)
router.get('/dashboard/overview', authenticateToken, authorizeRoles('admin'), adminController.getMetricsOverview);

// Get admin dashboard metrics trends (admin only)
router.get('/dashboard/trends', authenticateToken, authorizeRoles('admin'), adminController.getMetricsTrends);

// Get recent activity feed (admin only)
router.get('/activity/recent', authenticateToken, authorizeRoles('admin'), adminController.getRecentActivity);

// Get system health metrics (admin only)
router.get('/system/health', authenticateToken, authorizeRoles('admin'), adminController.getSystemHealth);

module.exports = router;
