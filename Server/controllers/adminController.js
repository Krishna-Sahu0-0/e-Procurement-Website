const Admin = require('../models/Admin.js');
const Vendor = require('../models/Vendor.js');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        profilePhoto: admin.profilePhoto,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update vendor status
// @route   PUT /api/admin/vendors/:id
const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.status = status;
    await vendor.save();

    res.json({
      message: `Vendor ${status.toLowerCase()} successfully`,
      vendor,
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Upload admin profile photo
// @route   PUT /api/admin/upload-photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update profile photo
    admin.profilePhoto = profilePhoto;
    await admin.save();

    res.json({ 
      message: 'Profile photo uploaded successfully', 
      profilePhoto: admin.profilePhoto 
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if current password is correct
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Change admin email
// @route   PUT /api/admin/change-email
// @access  Private
const changeEmail = async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if current password is correct
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if email already exists
    const emailExists = await Admin.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Update email
    admin.email = newEmail;
    await admin.save();

    res.json({ message: 'Email changed successfully', email: admin.email });
  } catch (error) {
    console.error('Email change error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { loginAdmin, getAllVendors, updateVendorStatus, uploadProfilePhoto, changePassword, changeEmail };
