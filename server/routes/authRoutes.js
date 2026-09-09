import express from 'express';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';

const router = express.Router();

// In-memory user fallback
let fallbackUsers = [];

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { fullName, email, phone, city, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and password are required'
    });
  }

  try {
    if (isDBConnected()) {
      // MongoDB integration
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        phone: phone || '',
        city: city || 'Mumbai',
        password // Stored for lab demo
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully in MongoDB',
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
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
        password
      };
      fallbackUsers.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (in-memory mode)',
        user: {
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          city: newUser.city,
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
// @desc    Authenticate user login
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
      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      return res.json({
        success: true,
        message: 'Login successful (MongoDB)',
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
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

      const userName = email.includes('@') ? email.split('@')[0] : 'Member';
      return res.json({
        success: true,
        message: 'Login successful (in-memory mode)',
        user: {
          id: user ? user.id : 'USR-' + Math.floor(1000 + Math.random() * 9000),
          name: user ? user.fullName : userName,
          email: email.toLowerCase(),
          phone: user ? user.phone : '+91 98201 45678',
          city: user ? user.city : 'Mumbai',
          avatar: user ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : userName.slice(0, 2).toUpperCase()
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

export default router;
