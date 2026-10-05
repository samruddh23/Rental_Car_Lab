import express from 'express';
import mongoose from 'mongoose';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import { protect, verifyAdmin, verifySuperAdmin } from '../middleware/authMiddleware.js';
import { fallbackUsers } from './authRoutes.js';

const router = express.Router();

// =========================================================================
// DASHBOARD ANALYTICS (Experiment 6 & 7)
// =========================================================================

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for fleet and reservations
router.get('/stats', async (req, res) => {
  try {
    if (isDBConnected()) {
      const [totalCars, availableCars, totalBookings, totalUsers] = await Promise.all([
        Car.countDocuments(),
        Car.countDocuments({ available: true }),
        Booking.countDocuments(),
        User.countDocuments()
      ]);

      const revenueAgg = await Booking.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

      const statusAgg = await Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const statusCounts = {};
      statusAgg.forEach(s => {
        statusCounts[s._id] = s.count;
      });

      return res.json({
        success: true,
        source: 'mongodb',
        stats: {
          totalCars,
          availableCars,
          totalBookings,
          totalUsers,
          totalRevenue,
          statusCounts,
          database: {
            type: 'MongoDB',
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            status: 'Connected'
          }
        }
      });
    } else {
      return res.json({
        success: true,
        source: 'in-memory-fallback',
        stats: {
          totalCars: 6,
          availableCars: 6,
          totalBookings: 1,
          totalUsers: fallbackUsers.length,
          totalRevenue: 12386,
          statusCounts: { Confirmed: 1 },
          database: {
            type: 'In-Memory Fallback',
            host: 'localhost',
            name: 'mock_store',
            status: 'Simulated'
          }
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats: ' + error.message
    });
  }
});

// =========================================================================
// FEATURE 2: ADMIN CAPABILITIES (Customer Management)
// Protected by: protect, verifyAdmin
// =========================================================================

// @route   GET /api/admin/customers
// @desc    Fetch list of all customer accounts
// @access  Admin & Super Admin
router.get('/customers', protect, verifyAdmin, async (req, res) => {
  try {
    if (isDBConnected()) {
      const customers = await User.find({ role: 'customer' })
        .select('-password')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: customers.length,
        customers: customers.map(c => ({
          id: c._id,
          name: c.fullName || c.name || 'Customer',
          email: c.email,
          phone: c.phone || '',
          city: c.city || 'Mumbai',
          role: c.role,
          status: c.status || 'active',
          createdAt: c.createdAt
        }))
      });
    } else {
      const customers = fallbackUsers.filter(u => u.role === 'customer');
      return res.json({
        success: true,
        count: customers.length,
        customers: customers.map(c => ({
          id: c.id,
          name: c.fullName || c.name || 'Customer',
          email: c.email,
          phone: c.phone || '',
          city: c.city || 'Mumbai',
          role: c.role,
          status: c.status || 'active',
          createdAt: c.createdAt || new Date().toISOString()
        }))
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customers: ' + error.message
    });
  }
});

// @route   DELETE /api/admin/customers/:id
// @desc    Delete a specific customer account
// @access  Admin & Super Admin
router.delete('/customers/:id', protect, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isDBConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Customer account not found'
        });
      }

      // Security check: cannot delete administrators or super administrators via this route
      if (user.role === 'admin' || user.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Security Violation: Cannot delete Administrator or Super Admin accounts'
        });
      }

      await User.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: `Customer account (${user.email}) deleted successfully`
      });
    } else {
      const userIndex = fallbackUsers.findIndex(u => u.id === id || u.email === id);
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Customer account not found'
        });
      }

      const target = fallbackUsers[userIndex];
      if (target.role === 'admin' || target.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Security Violation: Cannot delete Administrator accounts'
        });
      }

      fallbackUsers.splice(userIndex, 1);
      return res.json({
        success: true,
        message: `Customer account (${target.email}) deleted successfully (in-memory mode)`
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting customer account: ' + error.message
    });
  }
});

// @route   PUT /api/admin/customers/:id/status
// @desc    Disable/Ban or Enable a customer account
// @access  Admin & Super Admin
router.put('/customers/:id/status', protect, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'disabled'

  if (!['active', 'disabled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Permitted values: "active" or "disabled"'
    });
  }

  try {
    if (isDBConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      if (user.role === 'admin' || user.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot disable an Administrator account'
        });
      }

      user.status = status;
      await user.save();

      return res.json({
        success: true,
        message: `Customer account status updated to "${status}"`,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          status: user.status
        }
      });
    } else {
      const target = fallbackUsers.find(u => u.id === id || u.email === id);
      if (!target) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      if (target.role === 'admin' || target.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot disable an Administrator account'
        });
      }

      target.status = status;
      return res.json({
        success: true,
        message: `Customer account status updated to "${status}" (in-memory mode)`,
        user: {
          id: target.id,
          name: target.fullName,
          email: target.email,
          status: target.status
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update customer status: ' + error.message
    });
  }
});

// =========================================================================
// FEATURE 2: SUPER ADMIN CAPABILITIES (Admin Management & Promotions)
// Protected by: protect, verifySuperAdmin
// =========================================================================

// @route   GET /api/admin/admins
// @desc    Fetch list of all Admin and Super Admin accounts
// @access  Super Admin Only
router.get('/admins', protect, verifySuperAdmin, async (req, res) => {
  try {
    if (isDBConnected()) {
      const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } })
        .select('-password')
        .sort({ role: 1, createdAt: -1 });

      return res.json({
        success: true,
        count: admins.length,
        admins: admins.map(a => ({
          id: a._id,
          name: a.fullName || a.name || 'Admin',
          email: a.email,
          phone: a.phone || '',
          city: a.city || 'Mumbai',
          role: a.role,
          status: a.status || 'active',
          createdAt: a.createdAt
        }))
      });
    } else {
      const admins = fallbackUsers.filter(u => u.role === 'admin' || u.role === 'super_admin');
      return res.json({
        success: true,
        count: admins.length,
        admins: admins.map(a => ({
          id: a.id,
          name: a.fullName || a.name || 'Admin',
          email: a.email,
          phone: a.phone || '',
          city: a.city || 'Mumbai',
          role: a.role,
          status: a.status || 'active',
          createdAt: a.createdAt || new Date().toISOString()
        }))
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin accounts: ' + error.message
    });
  }
});

// @route   POST /api/admin/create-admin
// @desc    Create a new administrator account
// @access  Super Admin Only
router.post('/create-admin', protect, verifySuperAdmin, async (req, res) => {
  const { fullName, email, password, phone, city } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and password are required to create an Admin'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Admin password must be at least 6 characters'
    });
  }

  try {
    if (isDBConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const newAdmin = await User.create({
        fullName,
        email: email.toLowerCase(),
        password,
        phone: phone || '+91 98200 00000',
        city: city || 'Mumbai',
        role: 'admin',
        status: 'active'
      });

      return res.status(201).json({
        success: true,
        message: `Admin account created successfully for ${email}`,
        admin: {
          id: newAdmin._id,
          name: newAdmin.fullName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          city: newAdmin.city,
          role: newAdmin.role,
          status: newAdmin.status
        }
      });
    } else {
      const existing = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const newAdmin = {
        id: 'USR-ADMIN-' + Math.floor(100 + Math.random() * 900),
        fullName,
        email: email.toLowerCase(),
        password,
        phone: phone || '+91 98200 00000',
        city: city || 'Mumbai',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      fallbackUsers.push(newAdmin);

      return res.status(201).json({
        success: true,
        message: `Admin account created successfully for ${email} (in-memory mode)`,
        admin: {
          id: newAdmin.id,
          name: newAdmin.fullName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          city: newAdmin.city,
          role: newAdmin.role,
          status: newAdmin.status
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create admin: ' + error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/promote
// @desc    Promote an existing customer to Admin or Demote back
// @access  Super Admin Only
router.put('/users/:id/promote', protect, verifySuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { role = 'admin' } = req.body;

  if (!['admin', 'customer'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role can only be promoted to "admin" or reverted to "customer"'
    });
  }

  try {
    if (isDBConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found'
        });
      }

      if (user.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Super Admin role cannot be modified via promotion endpoint'
        });
      }

      user.role = role;
      await user.save();

      return res.json({
        success: true,
        message: `User ${user.email} successfully ${role === 'admin' ? 'promoted to Administrator' : 'reverted to Customer'}`,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          role: user.role
        }
      });
    } else {
      const target = fallbackUsers.find(u => u.id === id || u.email === id);
      if (!target) {
        return res.status(404).json({
          success: false,
          message: 'User account not found'
        });
      }

      if (target.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Super Admin role cannot be modified'
        });
      }

      target.role = role;
      return res.json({
        success: true,
        message: `User ${target.email} successfully ${role === 'admin' ? 'promoted to Administrator' : 'reverted to Customer'} (in-memory mode)`,
        user: {
          id: target.id,
          name: target.fullName,
          email: target.email,
          role: target.role
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role: ' + error.message
    });
  }
});

export default router;
