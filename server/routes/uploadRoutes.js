import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   POST /api/upload/document
// @desc    Upload user Driving Licence or ID document (Experiment 8)
router.post('/document', (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided for upload'
      });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'Government ID / Driving Licence document uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        relativePath: `/uploads/${req.file.filename}`
      }
    });
  });
});

// @route   POST /api/upload/vehicle
// @desc    Upload vehicle photo for fleet inventory (Experiment 8)
router.post('/vehicle', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Vehicle image upload error'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No vehicle image file provided'
      });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'Vehicle image uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        relativePath: `/uploads/${req.file.filename}`
      }
    });
  });
});

export default router;
