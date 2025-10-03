const Vendor = require('../models/vendor.js');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new vendor
// @route   POST /api/vendors/register
const registerVendor = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    // Validate input
    if (!companyName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const vendorExists = await Vendor.findOne({ email });

    if (vendorExists) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    const vendor = await Vendor.create({
      companyName,
      email,
      password,
    });

    if (vendor) {
      res.status(201).json({
        _id: vendor._id,
        companyName: vendor.companyName,
        email: vendor.email,
        status: vendor.status,
        token: generateToken(vendor._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid vendor data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate a vendor (login)
// @route   POST /api/vendors/login
const authVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const vendor = await Vendor.findOne({ email });

    if (vendor && (await vendor.matchPassword(password))) {
      res.json({
        _id: vendor._id,
        companyName: vendor.companyName,
        email: vendor.email,
        status: vendor.status,
        token: generateToken(vendor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

module.exports = { registerVendor, authVendor };