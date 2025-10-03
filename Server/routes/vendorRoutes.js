const express = require('express');
const router = express.Router();
const { registerVendor, authVendor } = require('../controllers/vendorController.js');

router.post('/register', registerVendor);
router.post('/login', authVendor);

module.exports = router;