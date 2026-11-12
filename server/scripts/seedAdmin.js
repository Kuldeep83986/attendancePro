const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Settings = require('../models/Settings');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:');
      console.log(`  Email: ${existingAdmin.email}`);
      console.log('Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@attendancepro.com',
      phone: '0000000000',
      password: 'Admin@123',
      role: 'admin',
      status: 'approved',
    });

    console.log('Admin user created successfully:');
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: Admin@123`);
    console.log('');
    console.log('IMPORTANT: Change this password after first login!');

    // Initialize settings
    await Settings.getSettings();
    console.log('Default settings initialized.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();

