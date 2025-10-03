const Vendor = require('../models/Vendor.js');
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
        profilePhoto: vendor.profilePhoto,
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

// @desc    Upload vendor profile photo
// @route   PUT /api/vendors/upload-photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const vendor = await Vendor.findById(req.vendor._id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Update profile photo
    vendor.profilePhoto = profilePhoto;
    await vendor.save();

    res.json({ 
      message: 'Profile photo uploaded successfully', 
      profilePhoto: vendor.profilePhoto 
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Change vendor password
// @route   PUT /api/vendors/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const vendor = await Vendor.findById(req.vendor._id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Check if current password is correct
    const isMatch = await vendor.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    vendor.password = newPassword;
    await vendor.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Change vendor email
// @route   PUT /api/vendors/change-email
// @access  Private
const changeEmail = async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    const vendor = await Vendor.findById(req.vendor._id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Check if current password is correct
    const isMatch = await vendor.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if email already exists
    const emailExists = await Vendor.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Update email
    vendor.email = newEmail;
    await vendor.save();

    res.json({ message: 'Email changed successfully', email: vendor.email });
  } catch (error) {
    console.error('Email change error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { registerVendor, authVendor, changePassword, changeEmail, uploadProfilePhoto };
