import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'ApexDrive Bharat MERN Car Rental API',
    database: isDBConnected() ? 'MongoDB (Connected)' : 'In-Memory Fallback Mode',
    timestamp: new Date().toISOString()
  });
});

// Start Server and initialize Database Connection
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` 🚗 ApexDrive Bharat REST API Server Running `);
    console.log(` 🌐 Port: http://localhost:${PORT}`);
    console.log(` 🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(` 🏎️  Cars API: http://localhost:${PORT}/api/cars`);
    console.log(` 📅 Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(` 🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(` 🗄️  Database: ${isDBConnected() ? 'MongoDB' : 'In-Memory Fallback'}`);
    console.log(`=========================================`);
  });
};

startServer();
