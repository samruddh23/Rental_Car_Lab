import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    carId: {
      type: Number,
      required: true
    },
    carMake: {
      type: String,
      required: true
    },
    carModel: {
      type: String,
      required: true
    },
    carType: {
      type: String,
      default: 'Standard'
    },
    carImage: {
      type: String,
      default: ''
    },
    pickupLocation: {
      type: String,
      required: true
    },
    returnLocation: {
      type: String,
      required: true
    },
    pickupDate: {
      type: String,
      required: true
    },
    returnDate: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      required: true,
      min: 1
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    aadhaarNumber: {
      type: String,
      default: ''
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Active', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
