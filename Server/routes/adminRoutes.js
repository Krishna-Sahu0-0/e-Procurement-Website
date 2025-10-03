const express = require('express');
const router = express.Router();
const { loginAdmin, getAllVendors, updateVendorStatus, uploadProfilePhoto, changePassword, changeEmail } = require('../controllers/adminController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/login', loginAdmin);
router.get('/vendors', protect, getAllVendors);
router.put('/vendors/:id', protect, updateVendorStatus);
router.put('/upload-photo', protect, uploadProfilePhoto);
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, changeEmail);

module.exports = router;
