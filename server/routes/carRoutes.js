import express from 'express';
import Car from '../models/Car.js';
import { isDBConnected } from '../config/db.js';
import { initialIndianFleet } from '../seed.js';

const router = express.Router();

// In-memory fleet fallback store (INR ₹ Pricing)
let fallbackFleet = [...initialIndianFleet];

// Helper to auto-seed if MongoDB collection is empty
const ensureSeeded = async () => {
  if (isDBConnected()) {
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('⚡ Initializing MongoDB vehicle collection with iconic Indian fleet...');
      await Car.insertMany(initialIndianFleet);
      console.log('✅ Auto-seed completed.');
    }
  }
};

// @route   GET /api/cars
// @desc    Get all vehicles with optional query filters (category, search)
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  try {
    if (isDBConnected()) {
      await ensureSeeded();

      let query = {};
      if (category && category !== 'all') {
        query.category = category.toLowerCase();
      }
      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [{ make: regex }, { model: regex }, { type: regex }];
      }

      const cars = await Car.find(query).sort({ id: 1 });
      return res.json({
        success: true,
        source: 'mongodb',
        currency: 'INR',
        count: cars.length,
        data: cars
      });
    } else {
      // In-memory fallback
      let results = [...fallbackFleet];
      if (category && category !== 'all') {
        results = results.filter(car => car.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(car => 
          car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.type.toLowerCase().includes(q)
        );
      }

      return res.json({
        success: true,
        source: 'in-memory-fallback',
        currency: 'INR',
        count: results.length,
        data: results
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicles: ' + error.message
    });
  }
});

// @route   GET /api/cars/:id
// @desc    Get vehicle by ID
router.get('/:id', async (req, res) => {
  const carId = parseInt(req.params.id, 10);

  try {
    if (isDBConnected()) {
      const car = await Car.findOne({ id: carId });
      if (!car) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${req.params.id} not found in MongoDB`
        });
      }
      return res.json({
        success: true,
        source: 'mongodb',
        data: car
      });
    } else {
      const car = fallbackFleet.find(c => c.id === carId);
      if (!car) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${req.params.id} not found`
        });
      }
      return res.json({
        success: true,
        source: 'in-memory-fallback',
        data: car
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching vehicle: ' + error.message
    });
  }
});

// @route   POST /api/cars
// @desc    Create a new vehicle
router.post('/', async (req, res) => {
  const { make, model, type, category, price, passengers, transmission, fuel, image } = req.body;

  if (!make || !model || !price) {
    return res.status(400).json({
      success: false,
      message: 'Make, model, and daily price (INR) are required fields'
    });
  }

  try {
    if (isDBConnected()) {
      const lastCar = await Car.findOne().sort({ id: -1 });
      const nextId = lastCar ? lastCar.id + 1 : 1;

      const newCar = await Car.create({
        id: nextId,
        make,
        model,
        type: type || 'Standard Indian Vehicle',
        category: category || 'sedan',
        price: Number(price),
        rating: 5.0,
        reviews: 0,
        transmission: transmission || 'Automatic',
        passengers: Number(passengers) || 5,
        fuel: fuel || 'Petrol',
        image: image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
        available: true
      });

      return res.status(201).json({
        success: true,
        source: 'mongodb',
        message: 'Vehicle added successfully to MongoDB',
        data: newCar
      });
    } else {
      const nextId = fallbackFleet.length > 0 ? Math.max(...fallbackFleet.map(c => c.id)) + 1 : 1;
      const newCar = {
        id: nextId,
        make,
        model,
        type: type || 'Standard Indian Vehicle',
        category: category || 'sedan',
        price: Number(price),
        rating: 5.0,
        reviews: 0,
        transmission: transmission || 'Automatic',
        passengers: Number(passengers) || 5,
        fuel: fuel || 'Petrol',
        image: image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
        available: true
      };

      fallbackFleet.push(newCar);

      return res.status(201).json({
        success: true,
        source: 'in-memory-fallback',
        message: 'Vehicle added successfully (in-memory mode)',
        data: newCar
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add vehicle: ' + error.message
    });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update vehicle details (price, availability, specs) - Experiment 6 CRUD Update
router.put('/:id', async (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const updates = req.body;

  try {
    if (isDBConnected()) {
      const updatedCar = await Car.findOneAndUpdate(
        { id: carId },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedCar) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${carId} not found in MongoDB`
        });
      }

      return res.json({
        success: true,
        source: 'mongodb',
        message: `Vehicle #${carId} updated successfully in MongoDB`,
        data: updatedCar
      });
    } else {
      const carIndex = fallbackFleet.findIndex(c => c.id === carId);
      if (carIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${carId} not found`
        });
      }

      fallbackFleet[carIndex] = {
        ...fallbackFleet[carIndex],
        ...updates
      };

      return res.json({
        success: true,
        source: 'in-memory-fallback',
        message: `Vehicle #${carId} updated successfully (in-memory mode)`,
        data: fallbackFleet[carIndex]
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update vehicle: ' + error.message
    });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete vehicle from fleet - Experiment 6 CRUD Delete
router.delete('/:id', async (req, res) => {
  const carId = parseInt(req.params.id, 10);

  try {
    if (isDBConnected()) {
      const deletedCar = await Car.findOneAndDelete({ id: carId });
      if (!deletedCar) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${carId} not found in MongoDB`
        });
      }

      return res.json({
        success: true,
        source: 'mongodb',
        message: `Vehicle #${carId} (${deletedCar.make} ${deletedCar.model}) deleted from MongoDB`,
        data: deletedCar
      });
    } else {
      const initialLength = fallbackFleet.length;
      fallbackFleet = fallbackFleet.filter(c => c.id !== carId);

      if (fallbackFleet.length === initialLength) {
        return res.status(404).json({
          success: false,
          message: `Vehicle with id ${carId} not found`
        });
      }

      return res.json({
        success: true,
        source: 'in-memory-fallback',
        message: `Vehicle #${carId} deleted successfully`
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle: ' + error.message
    });
  }
});

export default router;

