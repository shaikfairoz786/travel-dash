const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Import package controller
const packageController = require('../controllers/packageController');

// Get all active packages (public - with search and pagination)
router.get('/', packageController.getAllPackages);

// Get a single package by slug (public)
router.get('/:slug', packageController.getPackageBySlug);

// Admin routes for package management
// Get all packages for admin (including inactive ones)
router.get('/admin/all', authenticateToken, authorizeRoles('admin'), packageController.getAllPackagesAdmin);

// Create a new package (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), packageController.createPackage);

// Update a package (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), packageController.updatePackage);

// Delete a package (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), packageController.deletePackage);

module.exports = router;
