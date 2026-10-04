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

export default router;
