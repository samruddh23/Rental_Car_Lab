import express from 'express';

const router = express.Router();

// In-memory data store for vehicles (MERN architecture model)
let fleet = [
  { 
    id: 1, 
    make: 'Porsche', 
    model: '911 Carrera S', 
    type: 'Sports Convertible', 
    category: 'sports',
    price: 180,
    rating: 4.95,
    reviews: 184,
    transmission: 'Automatic',
    passengers: 4,
    fuel: 'Premium Gas',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 2, 
    make: 'Tesla', 
    model: 'Model Y Long Range', 
    type: 'Electric Crossover', 
    category: 'electric',
    price: 95,
    rating: 4.88,
    reviews: 215,
    transmission: 'Automatic',
    passengers: 5,
    fuel: 'Electric',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 3, 
    make: 'Range Rover', 
    model: 'Sport Luxury', 
    type: 'Luxury SUV', 
    category: 'suv',
    price: 140,
    rating: 4.91,
    reviews: 98,
    transmission: 'Automatic',
    passengers: 7,
    fuel: 'Mild Hybrid',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 4, 
    make: 'Mercedes-Benz', 
    model: 'C-Class AMG Line', 
    type: 'Premium Sedan', 
    category: 'sedan',
    price: 75,
    rating: 4.82,
    reviews: 142,
    transmission: 'Automatic',
    passengers: 5,
    fuel: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 5, 
    make: 'Ford', 
    model: 'Bronco Wildtrak', 
    type: 'Off-Road SUV', 
    category: 'suv',
    price: 110,
    rating: 4.87,
    reviews: 73,
    transmission: 'Automatic',
    passengers: 5,
    fuel: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 6, 
    make: 'Audi', 
    model: 'e-tron GT', 
    type: 'Electric Sports Sedan', 
    category: 'electric',
    price: 220,
    rating: 4.97,
    reviews: 54,
    transmission: 'Automatic',
    passengers: 4,
    fuel: 'Electric',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'
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
// @desc    Create a new vehicle (Admin API)
router.post('/', (req, res) => {
  const { make, model, type, category, price, passengers, transmission, fuel, image } = req.body;

  if (!make || !model || !price) {
    return res.status(400).json({
      success: false,
      message: 'Make, model, and daily price are required fields'
    });
  }

  const newCar = {
    id: fleet.length > 0 ? Math.max(...fleet.map(c => c.id)) + 1 : 1,
    make,
    model,
    type: type || 'Standard Vehicle',
    category: category || 'sedan',
    price: Number(price),
    rating: 5.0,
    reviews: 0,
    transmission: transmission || 'Automatic',
    passengers: Number(passengers) || 5,
    fuel: fuel || 'Gasoline',
    image: image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  };

  fleet.push(newCar);

  res.status(201).json({
    success: true,
    message: 'Vehicle added successfully',
    data: newCar
  });
});

export default router;
