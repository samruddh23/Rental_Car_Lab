import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB, isDBConnected } from './config/db.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes, { seedDefaultUsers } from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import realtimeRoutes from './routes/realtimeRoutes.js';
import testRoutes from './routes/testRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io WebSockets (Experiment 9)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static uploaded documents & vehicle media (Experiment 8)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach Socket.io instance to req for route event emission (Experiment 9)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// Socket.io Real-Time Connection Handler (Experiment 9)
io.on('connection', (socket) => {
  console.log(`🔌 [WebSocket] Client Connected: ${socket.id} (Total: ${io.engine.clientsCount})`);

  // Client joining real-time room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`🔌 [WebSocket] Socket ${socket.id} joined room: ${room}`);
  });

  // Live ApexDrive Sahayak Support Chat (Experiment 9)
  socket.on('support_message', (data) => {
    console.log(`💬 [Sahayak Chat] Message received from ${data.sender}: ${data.text}`);
    // Simulated intelligent assistant response
    setTimeout(() => {
      let reply = "Namaste! I am ApexDrive Sahayak 🚗. How may I assist you with your journey today?";
      const lower = (data.text || '').toLowerCase();
      if (lower.includes('fastag') || lower.includes('toll')) {
        reply = "All ApexDrive Bharat vehicles include pre-activated FASTag for seamless toll booth passing across national highways!";
      } else if (lower.includes('gst') || lower.includes('invoice')) {
        reply = "GST tax invoices (SAC 996601) with 18% tax breakdown are automatically generated after booking confirmation.";
      } else if (lower.includes('deposit') || lower.includes('security')) {
        reply = "Security deposits are 100% refundable within 24 hours of vehicle return inspection.";
      } else if (lower.includes('thar') || lower.includes('suv')) {
        reply = "Mahindra Thar 4x4 and Toyota Fortuner Legender are in high demand! Book early for weekends.";
      }

      socket.emit('sahayak_reply', {
        id: 'MSG-' + Date.now(),
        sender: 'ApexDrive Sahayak 🤖',
        text: reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    }, 400);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [WebSocket] Client Disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);     // Exp 8: File Uploads
app.use('/api/payment', paymentRoutes);   // Exp 8: Razorpay & GST Invoice
app.use('/api/realtime', realtimeRoutes); // Exp 9: WebSockets
app.use('/api/tests', testRoutes);        // Exp 10: Automated Test Runner

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'ApexDrive Bharat MERN Car Rental API',
    experiments: 'Experiments 1 - 10 Complete',
    database: isDBConnected() ? 'MongoDB (Connected)' : 'In-Memory Fallback Mode',
    websockets: `Socket.io Active (${io.engine?.clientsCount || 0} clients)`,
    timestamp: new Date().toISOString()
  });
});

// Production: Serve React Vite static build
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server and initialize Database Connection
const startServer = async () => {
  // Connect to MongoDB & seed initial users
  await connectDB();
  await seedDefaultUsers();

  httpServer.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` 🚗 ApexDrive Bharat REST API Server Running `);
    console.log(` 🌐 Port: http://localhost:${PORT}`);
    console.log(` 🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(` 🏎️  Cars API: http://localhost:${PORT}/api/cars`);
    console.log(` 📅 Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(` 🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(` 📁 Upload API: http://localhost:${PORT}/api/upload (Exp 8)`);
    console.log(` 💳 Payment API: http://localhost:${PORT}/api/payment (Exp 8)`);
    console.log(` ⚡ WebSockets: http://localhost:${PORT} (Exp 9)`);
    console.log(` 🧪 Tests API: http://localhost:${PORT}/api/tests/run (Exp 10)`);
    console.log(` 🗄️  Database: ${isDBConnected() ? 'MongoDB' : 'In-Memory Fallback'}`);
    console.log(`=========================================`);
  });
};

startServer();
