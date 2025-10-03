const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin.js');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@eprocurement.com' });
    
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    // Create admin
    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@eprocurement.com',
      password: 'admin123', // This will be hashed automatically
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@eprocurement.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
