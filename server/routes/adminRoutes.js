import express from 'express';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for fleet and reservations (Experiment 6 & 7)
router.get('/stats', async (req, res) => {
  try {
    if (isDBConnected()) {
      const [totalCars, availableCars, totalBookings, totalUsers] = await Promise.all([
        Car.countDocuments(),
        Car.countDocuments({ available: true }),
        Booking.countDocuments(),
        User.countDocuments()
      ]);

      // Aggregate total revenue and count by status
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
      // In-memory fallback stats
      return res.json({
        success: true,
        source: 'in-memory-fallback',
        stats: {
          totalCars: 6,
          availableCars: 6,
          totalBookings: 1,
          totalUsers: 1,
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

export default router;
