const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true, default: 'Pending' }, // Pending, Approved, Rejected
  profilePhoto: { type: String, default: '' } // Base64 encoded image or URL
}, {
  timestamps: true
});

// This function will run before a vendor document is saved
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
vendorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;