import express from 'express';
import Booking from '../models/Booking.js';
import { isDBConnected } from '../config/db.js';

const router = express.Router();

// @route   POST /api/payment/create-order
// @desc    Simulate Razorpay / UPI order creation (Experiment 8)
router.post('/create-order', async (req, res) => {
  const { amount, bookingId, customerName, customerEmail } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required to create a payment order'
    });
  }

  const orderId = 'order_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  const order = {
    id: orderId,
    entity: 'order',
    amount: Math.round(Number(amount) * 100), // amount in paise
    amount_paid: 0,
    amount_due: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: `rcpt_${bookingId || Date.now()}`,
    status: 'created',
    attempts: 0,
    created_at: Math.floor(Date.now() / 1000),
    notes: {
      merchant: 'ApexDrive Bharat Pvt Ltd',
      bookingId: bookingId || 'N/A',
      customer: customerName || 'Valued Customer',
      email: customerEmail || 'guest@apexdrive.in'
    }
  };

  return res.status(201).json({
    success: true,
    message: 'Razorpay / UPI Payment order generated successfully',
    keyId: 'rzp_test_ApexDrive2026',
    order
  });
});

// @route   POST /api/payment/verify
// @desc    Verify payment transaction & mark booking as paid (Experiment 8)
router.post('/verify', async (req, res) => {
  const { orderId, paymentId, bookingId, paymentMethod } = req.body;

  if (!orderId || !paymentId) {
    return res.status(400).json({
      success: false,
      message: 'Order ID and Payment ID are required for verification'
    });
  }

  const txnId = paymentId.startsWith('pay_') ? paymentId : 'pay_' + Date.now().toString(36);

  try {
    if (bookingId && isDBConnected()) {
      await Booking.findOneAndUpdate(
        { id: bookingId },
        { 
          $set: { 
            paymentStatus: 'Paid',
            paymentId: txnId,
            paymentMethod: paymentMethod || 'UPI / NetBanking',
            paidAt: new Date().toISOString()
          } 
        }
      );
    }

    return res.json({
      success: true,
      message: 'Payment verified and confirmed successfully!',
      transaction: {
        paymentId: txnId,
        orderId,
        bookingId: bookingId || 'N/A',
        paymentMethod: paymentMethod || 'UPI (Google Pay / PhonePe)',
        verifiedAt: new Date().toISOString(),
        status: 'CAPTURED'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed: ' + error.message
    });
  }
});

// @route   GET /api/payment/invoice/:bookingId
// @desc    Generate GST Tax Invoice data for booking (Experiment 8)
router.get('/invoice/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  try {
    let booking = null;
    if (isDBConnected()) {
      booking = await Booking.findOne({ id: bookingId });
    }

    const total = booking ? Number(booking.totalAmount) : 12386;
    const baseFare = Math.round(total / 1.18);
    const gstTotal = total - baseFare;
    const cgst = Math.round(gstTotal / 2);
    const sgst = gstTotal - cgst;

    const invoice = {
      invoiceNumber: `INV-APEX-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      company: {
        name: 'ApexDrive Bharat Mobility Technologies Pvt. Ltd.',
        gstin: '27AABCA1234F1Z9',
        pan: 'AABCA1234F',
        address: 'Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
        supportEmail: 'billing@apexdrive.in',
        hsnSacCode: '996601 (Passenger motor vehicle rental services with or without operator)'
      },
      customer: {
        name: booking?.customerName || 'Samruddh Jadhav',
        email: booking?.customerEmail || 'samruddh.jadhav@ves.ac.in',
        phone: booking?.customerPhone || '+91 98201 45678',
        license: booking?.licenseNumber || 'MH02-2023-0091823'
      },
      rentalDetails: {
        bookingId,
        vehicle: `${booking?.carMake || 'Mahindra'} ${booking?.carModel || 'Thar 4x4'}`,
        pickup: `${booking?.pickupDate || '2026-10-01'} (${booking?.pickupLocation || 'Mumbai Central Hub'})`,
        return: `${booking?.returnDate || '2026-10-05'} (${booking?.returnLocation || 'Goa Coastal Hub'})`,
        duration: `${booking?.days || 4} Days`
      },
      billing: {
        baseRate: baseFare,
        fastagFee: 499,
        securityDepositRefundable: 2000,
        cgst9Percent: cgst,
        sgst9Percent: sgst,
        totalGst18Percent: gstTotal,
        totalAmountPaid: total,
        currency: 'INR (₹)',
        paymentStatus: 'PAID (Verified via Razorpay / UPI)'
      }
    };

    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate tax invoice: ' + error.message
    });
  }
});

export default router;
