const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const setupAdminValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('setupKey').notEmpty().withMessage('Setup key is required'),
];

// @desc    Register new employee
// @route   POST /api/auth/register
// @access  Public
const register = [
  ...registerValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, email, phone, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      // Create user with pending status
      await User.create({
        name,
        email,
        phone,
        password,
        role: 'employee',
        status: 'pending',
      });

      res.status(201).json({
        message: 'Registration submitted successfully. Please wait for admin approval.',
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = [
  ...loginValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check employee approval status
      if (user.role === 'employee') {
        if (user.status === 'pending') {
          return res.status(403).json({
            message: 'Your account is pending admin approval. Please wait.',
          });
        }
        if (user.status === 'rejected') {
          return res.status(403).json({
            message: 'Your registration has been rejected. Please contact admin.',
          });
        }
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          employeeId: user.employeeId,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },
];

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Setup initial admin account (one-time)
// @route   POST /api/auth/setup-admin
// @access  Public (protected by setup key)
const setupAdmin = [
  ...setupAdminValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, email, phone, password, setupKey } = req.body;

      // Verify setup key
      if (setupKey !== process.env.ADMIN_SETUP_KEY) {
        return res.status(403).json({ message: 'Invalid setup key' });
      }

      // Check if admin already exists
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin account already exists' });
      }

      // Check if email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Create admin
      const admin = await User.create({
        name,
        email,
        phone,
        password,
        role: 'admin',
        status: 'approved',
      });

      res.status(201).json({
        message: 'Admin account created successfully',
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error('Setup admin error:', error);
      res.status(500).json({ message: 'Server error during admin setup' });
    }
  },
];

module.exports = { register, login, getMe, setupAdmin };

