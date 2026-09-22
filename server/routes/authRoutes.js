import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apexdrive_bharat_jwt_secret_key_2026';

// Helper to generate JWT token (Experiment 7)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.fullName || user.name,
      role: user.role || 'customer'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// In-memory user fallback
let fallbackUsers = [
  {
    id: 'USR-ADMIN',
    fullName: 'Chief Fleet Admin',
    email: 'admin@apexdrive.in',
    phone: '+91 98200 00000',
    city: 'Mumbai',
    password: 'adminpassword123',
    role: 'admin'
  }
];

// @route   POST /api/auth/signup
// @desc    Register a new user & return JWT token (Experiment 7)
router.post('/signup', async (req, res) => {
  const { fullName, email, phone, city, password, role } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and password are required'
    });
  }

  const assignedRole = role === 'admin' || email.toLowerCase().includes('admin') ? 'admin' : 'customer';

  try {
    if (isDBConnected()) {
      // MongoDB integration (Experiment 6)
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      // Password will be automatically hashed by User.js pre('save') hook
      const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        phone: phone || '',
        city: city || 'Mumbai',
        password,
        role: assignedRole
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully with secure JWT token (MongoDB)',
        token,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          role: user.role,
          avatar: user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      });
    } else {
      // In-memory fallback
      const existing = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const newUser = {
        id: 'USR-' + (fallbackUsers.length + 1001),
        fullName,
        email: email.toLowerCase(),
        phone: phone || '',
        city: city || 'Mumbai',
        password,
        role: assignedRole
      };
      fallbackUsers.push(newUser);

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully with JWT token (in-memory mode)',
        token,
        user: {
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          city: newUser.city,
          role: newUser.role,
          avatar: newUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating account: ' + error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user login & return JWT token (Experiment 7)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    if (isDBConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password using bcrypt or plain text fallback if previously created
      let isMatch = false;
      if (typeof user.comparePassword === 'function') {
        isMatch = await user.comparePassword(password);
      }
      if (!isMatch && user.password === password) {
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Login successful with JWT authorization (MongoDB)',
        token,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          role: user.role || 'customer',
          avatar: user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      });
    } else {
      // In-memory check or mock accept
      const user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const userName = user ? user.fullName : (email.includes('@') ? email.split('@')[0] : 'Member');
      const authUser = {
        id: user ? user.id : 'USR-' + Math.floor(1000 + Math.random() * 9000),
        fullName: userName,
        email: email.toLowerCase(),
        phone: user ? user.phone : '+91 98201 45678',
        city: user ? user.city : 'Mumbai',
        role: user ? user.role : (email.includes('admin') ? 'admin' : 'customer')
      };

      const token = generateToken(authUser);

      return res.json({
        success: true,
        message: 'Login successful with JWT token (in-memory mode)',
        token,
        user: {
          id: authUser.id,
          name: authUser.fullName,
          email: authUser.email,
          phone: authUser.phone,
          city: authUser.city,
          role: authUser.role,
          avatar: authUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login error: ' + error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently authenticated user from JWT token (Experiment 7 Protected Route)
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'User authenticated successfully via JWT token',
    user: {
      id: req.user._id || req.user.id,
      name: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      city: req.user.city,
      role: req.user.role,
      avatar: req.user.fullName ? req.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
    }
  });
});

export default router;
