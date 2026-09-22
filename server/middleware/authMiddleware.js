import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'apexdrive_bharat_jwt_secret_key_2026';

/**
 * Protect routes: verify JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isDBConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }
      req.user = user;
    } else {
      // In-memory fallback
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        fullName: decoded.name || 'Member',
        email: decoded.email,
        role: decoded.role || 'customer'
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token: ' + error.message
    });
  }
};

/**
 * Authorize only admin users
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin privileges required for this action'
    });
  }
  next();
};
