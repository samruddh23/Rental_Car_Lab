import express from 'express';
import Booking from '../models/Booking.js';
import { isDBConnected } from '../config/db.js';

const router = express.Router();

// In-memory data store fallback for bookings
let fallbackBookings = [];

// @route   GET /api/bookings
// @desc    Get all user bookings
router.get('/', async (req, res) => {
  try {
    if (isDBConnected()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'mongodb',
        count: bookings.length,
        data: bookings
      });
    } else {
      return res.json({
        success: true,
        source: 'in-memory-fallback',
        count: fallbackBookings.length,
        data: fallbackBookings
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings: ' + error.message
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new rental booking reservation
router.post('/', async (req, res) => {
  const {
    carId,
    carMake,
    carModel,
    carType,
    carImage,
    pickupLocation,
    returnLocation,
    pickupDate,
    returnDate,
    days,
    customerName,
    customerEmail,
    customerPhone,
    licenseNumber,
    aadhaarNumber,
    totalAmount
  } = req.body;

  // Basic validation
  if (!carId || !customerName || !customerEmail || !pickupDate || !returnDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required reservation fields'
    });
  }

  const bookingPayload = {
    id: 'BK-IN-' + Date.now().toString().slice(-6),
    carId,
    carMake: carMake || 'Vehicle',
    carModel: carModel || '',
    carType: carType || 'Standard',
    carImage: carImage || '',
    pickupLocation: pickupLocation || 'Mumbai Central Hub',
    returnLocation: returnLocation || 'Mumbai Central Hub',
    pickupDate,
    returnDate,
    days: Number(days) || 1,
    customerName,
    customerEmail,
    customerPhone,
    licenseNumber,
    aadhaarNumber: aadhaarNumber || '',
    totalAmount: Number(totalAmount) || 0,
    currency: 'INR',
    status: 'Confirmed'
  };

  try {
    if (isDBConnected()) {
      const newBooking = await Booking.create(bookingPayload);
      return res.status(201).json({
        success: true,
        source: 'mongodb',
        message: 'Booking reservation confirmed and saved in MongoDB',
        data: newBooking
      });
    } else {
      const newBooking = {
        ...bookingPayload,
        createdAt: new Date().toISOString()
      };
      fallbackBookings.unshift(newBooking);

      return res.status(201).json({
        success: true,
        source: 'in-memory-fallback',
        message: 'Booking reservation confirmed (in-memory mode)',
        data: newBooking
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking: ' + error.message
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isDBConnected()) {
      const deleted = await Booking.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Booking with ID ${id} not found in MongoDB`
        });
      }
      return res.json({
        success: true,
        source: 'mongodb',
        message: `Booking ${id} cancelled and removed from MongoDB`
      });
    } else {
      const initialLength = fallbackBookings.length;
      fallbackBookings = fallbackBookings.filter(b => b.id !== id);

      if (fallbackBookings.length === initialLength) {
        return res.status(404).json({
          success: false,
          message: `Booking with ID ${id} not found`
        });
      }

      return res.json({
        success: true,
        source: 'in-memory-fallback',
        message: `Booking ${id} cancelled successfully`
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking: ' + error.message
    });
  }
});

export default router;
