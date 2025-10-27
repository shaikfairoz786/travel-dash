const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Import user controller
const userController = require('../controllers/userController');

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Get authenticated user's profile
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;
