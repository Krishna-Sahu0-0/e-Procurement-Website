const express = require('express');
const router = express.Router();
const { loginAdmin, getAllVendors, updateVendorStatus } = require('../controllers/adminController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/login', loginAdmin);
router.get('/vendors', protect, getAllVendors);
router.put('/vendors/:id', protect, updateVendorStatus);

module.exports = router;
