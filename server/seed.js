import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Car from './models/Car.js';

export const initialIndianFleet = [
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
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    available: true
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
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    available: true
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
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
    available: true
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
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
    available: true
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
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    available: true
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
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    available: true
  }
];

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rental_car_db';

  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected! Seeding vehicle fleet...');

    await Car.deleteMany({});
    console.log('Cleared existing vehicle records.');

    await Car.insertMany(initialIndianFleet);
    console.log(`Successfully seeded ${initialIndianFleet.length} Indian vehicles into MongoDB!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during database seed:', err.message);
    process.exit(1);
  }
};

// If run directly: node seed.js
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedDatabase();
}
