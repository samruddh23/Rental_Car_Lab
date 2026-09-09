import express from 'express';

const router = express.Router();

// In-memory data store for bookings
let bookings = [];

// @route   GET /api/bookings
// @desc    Get all user bookings
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @route   POST /api/bookings
// @desc    Create a new rental booking reservation
router.post('/', (req, res) => {
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
    totalAmount
  } = req.body;

  // Basic validation
  if (!carId || !customerName || !customerEmail || !pickupDate || !returnDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required reservation fields'
    });
  }

  const newBooking = {
    id: 'BK-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    carId,
    carMake: carMake || 'Vehicle',
    carModel: carModel || '',
    carType: carType || 'Standard',
    carImage: carImage || '',
    pickupLocation: pickupLocation || 'Showroom',
    returnLocation: returnLocation || 'Showroom',
    pickupDate,
    returnDate,
    days: Number(days) || 1,
    customerName,
    customerEmail,
    customerPhone,
    licenseNumber,
    totalAmount: Number(totalAmount) || 0
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking reservation confirmed',
    data: newBooking
  });
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== id);

  if (bookings.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: `Booking with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    message: `Booking ${id} cancelled successfully`
  });
});

export default router;
