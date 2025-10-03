const express = require('express');
const router = express.Router();
const { registerVendor, authVendor, changePassword, changeEmail, uploadProfilePhoto } = require('../controllers/vendorController.js');
const { protectVendor } = require('../middleware/authMiddleware.js');

router.post('/register', registerVendor);
router.post('/login', authVendor);
router.put('/change-password', protectVendor, changePassword);
router.put('/change-email', protectVendor, changeEmail);
router.put('/upload-photo', protectVendor, uploadProfilePhoto);

module.exports = router;