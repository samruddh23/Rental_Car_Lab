import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['suv', 'sedan', 'electric', 'sports', 'all'],
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Daily rental rate in INR is required'],
      min: 0
    },
    rating: {
      type: Number,
      default: 4.85,
      min: 1,
      max: 5
    },
    reviews: {
      type: Number,
      default: 100
    },
    transmission: {
      type: String,
      default: 'Automatic'
    },
    passengers: {
      type: Number,
      default: 5
    },
    fuel: {
      type: String,
      default: 'Petrol'
    },
    image: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

export default Car;
