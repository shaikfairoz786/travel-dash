const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// Public route - no auth required
router.post('/', contactController.createContact);

// Admin routes - require authentication
router.get('/', authenticateToken, contactController.getAllContacts);
router.get('/:id', authenticateToken, contactController.getContactById);
router.put('/:id/status', authenticateToken, contactController.updateContactStatus);
router.delete('/:id', authenticateToken, contactController.deleteContact);

module.exports = router;
