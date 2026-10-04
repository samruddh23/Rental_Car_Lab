import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apexdrive_bharat_jwt_secret_key_2026';

// Helper to generate JWT token (Experiment 7)
const generateToken = (user) => {
  const isDedicatedAdmin = (user.email || '').toLowerCase().trim() === 'admin@apexdrive.in';
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.fullName || user.name,
      role: isDedicatedAdmin ? 'admin' : 'customer'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Preconfigured verified accounts: 1 Admin + 2 Customers
export const defaultUsers = [
  {
    id: 'USR-ADMIN-01',
    fullName: 'ApexDrive Administrator',
    email: 'admin@apexdrive.in',
    phone: '+91 98200 00000',
    city: 'Mumbai',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    id: 'USR-CUST-01',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98201 12345',
    city: 'Mumbai',
    password: 'Customer@123',
    role: 'customer'
  },
  {
    id: 'USR-CUST-02',
    fullName: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+91 98202 67890',
    city: 'Bengaluru',
    password: 'Customer@456',
    role: 'customer'
  }
];

let fallbackUsers = [...defaultUsers];

export const seedDefaultUsers = async () => {
  if (!isDBConnected()) return;
  try {
    for (const defUser of defaultUsers) {
      const existing = await User.findOne({ email: defUser.email.toLowerCase() });
      if (!existing) {
        await User.create({
          fullName: defUser.fullName,
          email: defUser.email.toLowerCase(),
          phone: defUser.phone,
          city: defUser.city,
          password: defUser.password,
          role: defUser.role
        });
        console.log(`👤 Seeded user into MongoDB: ${defUser.email} (${defUser.role})`);
      } else {
        if (existing.role !== defUser.role) {
          existing.role = defUser.role;
          await existing.save();
        }
      }
    }

    // Demote any other account in MongoDB to 'customer' (strictly 1 admin)
    await User.updateMany(
      { email: { $ne: 'admin@apexdrive.in' }, role: 'admin' },
      { $set: { role: 'customer' } }
    );
  } catch (err) {
    console.warn('⚠️ Error seeding default users in MongoDB:', err.message);
  }
};

// @route   POST /api/auth/signup
// @desc    Register a new user & return JWT token (Experiment 7)
router.post('/signup', async (req, res) => {
  const { fullName, email, phone, city, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and password are required'
    });
  }

  // Strictly enforce: only admin@apexdrive.in can ever have admin role
  const assignedRole = email.toLowerCase().trim() === 'admin@apexdrive.in' ? 'admin' : 'customer';

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
          role: user.email.toLowerCase().trim() === 'admin@apexdrive.in' ? 'admin' : 'customer',
          avatar: user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      });
    } else {
      // In-memory check: match existing fallback users or newly registered users
      const user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const authUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        phone: user.phone,
        city: user.city,
        role: user.email.toLowerCase().trim() === 'admin@apexdrive.in' ? 'admin' : 'customer'
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
      role: req.user.email.toLowerCase().trim() === 'admin@apexdrive.in' ? 'admin' : 'customer',
      avatar: req.user.fullName ? req.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
    }
  });
});

export default router;
