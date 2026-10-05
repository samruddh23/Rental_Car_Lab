import express from 'express';
import { runAutomatedTests } from '../tests/api.test.js';

const router = express.Router();

// @route   GET /api/tests/run
// @desc    Trigger automated test suite from browser dashboard (Experiment 10)
router.get('/run', async (req, res) => {
  try {
    const summary = await runAutomatedTests();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to execute automated tests: ' + error.message
    });
  }
});

// @route   POST /api/tests/send-test-email
// @desc    Diagnostic endpoint to test email delivery live
router.post('/send-test-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Recipient email is required' });

  try {
    const { sendBookingConfirmationEmail } = await import('../services/emailService.js');
    const result = await sendBookingConfirmationEmail({
      id: 'DIAG-' + Date.now().toString().slice(-4),
      carMake: 'Tata',
      carModel: 'Safari Dark Edition',
      customerName: 'Samruddh Jadhav',
      customerEmail: email,
      pickupDate: '2026-10-10',
      returnDate: '2026-10-12',
      days: 2,
      totalAmount: 4999
    });
    return res.json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
