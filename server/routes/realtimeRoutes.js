import express from 'express';

const router = express.Router();

// Helper endpoint to check real-time Socket.io status (Experiment 9)
router.get('/status', (req, res) => {
  const io = req.io;
  const socketCount = io ? io.engine?.clientsCount || 0 : 0;

  res.json({
    success: true,
    protocol: 'WebSocket / Socket.io v4',
    status: 'ACTIVE',
    activeConnections: socketCount,
    supportedEvents: [
      'new_booking_alert',
      'booking_status_updated',
      'fleet_updated',
      'support_message',
      'sahayak_reply'
    ],
    timestamp: new Date().toISOString()
  });
});

export default router;
