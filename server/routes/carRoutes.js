import express from 'express';

const router = express.Router();

// Indian fleet data store (INR ₹ Pricing)
let fleet = [
  { 
    id: 1, 
    make: 'Mahindra', 
    model: 'Thar 4x4 Hard Top', 
    type: 'Iconic Off-Road SUV', 
    category: 'suv',
    price: 3499,
    rating: 4.95,
    reviews: 320,
    transmission: 'Manual 4x4',
    passengers: 4,
    fuel: 'mHawk Diesel',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 2, 
    make: 'Toyota', 
    model: 'Fortuner Legender 4x4', 
    type: 'Executive 7-Seater Luxury SUV', 
    category: 'suv',
    price: 6999,
    rating: 4.93,
    reviews: 410,
    transmission: 'Automatic',
    passengers: 7,
    fuel: 'Diesel 2.8L',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 3, 
    make: 'Tata', 
    model: 'Nexon.ev Long Range', 
    type: 'Electric Smart Crossover', 
    category: 'electric',
    price: 2499,
    rating: 4.88,
    reviews: 280,
    transmission: 'Automatic',
    passengers: 5,
    fuel: 'Electric (465 km)',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 4, 
    make: 'Hyundai', 
    model: 'Creta SX(O) Panoramic', 
    type: 'Premium Urban SUV', 
    category: 'suv',
    price: 2199,
    rating: 4.86,
    reviews: 235,
    transmission: 'Automatic IVT',
    passengers: 5,
    fuel: 'Petrol / Diesel',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 5, 
    make: 'Maruti Suzuki', 
    model: 'Dzire ZXi+ AMT', 
    type: 'Economy City Sedan', 
    category: 'sedan',
    price: 1499,
    rating: 4.81,
    reviews: 510,
    transmission: 'Automatic / AMT',
    passengers: 5,
    fuel: 'Petrol (22.5 km/l)',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 6, 
    make: 'BMW', 
    model: '3 Series Gran Limousine', 
    type: 'VIP Luxury Executive Sedan', 
    category: 'sports',
    price: 11999,
    rating: 4.97,
    reviews: 140,
    transmission: 'Steptronic Auto',
    passengers: 5,
    fuel: 'TwinPower Turbo',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  }
];

// @route   GET /api/cars
// @desc    Get all vehicles with optional query filters (category, search)
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let results = [...fleet];

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

  res.json({
    success: true,
    currency: 'INR',
    count: results.length,
    data: results
  });
});

// @route   GET /api/cars/:id
// @desc    Get vehicle by ID
router.get('/:id', (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const car = fleet.find(c => c.id === carId);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: `Vehicle with id ${req.params.id} not found`
    });
  }

  res.json({
    success: true,
    data: car
  });
});

// @route   POST /api/cars
// @desc    Create a new vehicle
router.post('/', (req, res) => {
  const { make, model, type, category, price, passengers, transmission, fuel, image } = req.body;

  if (!make || !model || !price) {
    return res.status(400).json({
      success: false,
      message: 'Make, model, and daily price (INR) are required fields'
    });
  }

  const newCar = {
    id: fleet.length > 0 ? Math.max(...fleet.map(c => c.id)) + 1 : 1,
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
    image: image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  };

  fleet.push(newCar);

  res.status(201).json({
    success: true,
    message: 'Vehicle added successfully',
    data: newCar
  });
});

export default router;
