import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { CheckCircleIcon } from './Icons';

const getInitialDates = () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  return { today, tomorrow };
};

export const BookingForm = ({ car, onSuccess }) => {
  const navigate = useNavigate();
  const { addBooking } = useContext(CarContext);

  // Form State (Controlled Components)
  const [formData, setFormData] = useState(() => {
    const { today, tomorrow } = getInitialDates();
    return {
      pickupLocation: 'Downtown Los Angeles Showroom',
      returnLocation: 'Downtown Los Angeles Showroom',
      pickupDate: today,
      returnDate: tomorrow,
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    includeInsurance: true,
    includeGps: false,
    includeExtraDriver: false,
    agreeTerms: false
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Dynamic Date Calculation
  const calculateDays = () => {
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();

  // Price Calculation Breakdown
  const baseRate = car.price * days;
  const insuranceCost = formData.includeInsurance ? 15 * days : 0;
  const gpsCost = formData.includeGps ? 5 * days : 0;
  const driverCost = formData.includeExtraDriver ? 10 * days : 0;
  const addOnsTotal = insuranceCost + gpsCost + driverCost;
  const subtotal = baseRate + addOnsTotal;
  const tax = Math.round(subtotal * 0.08); // 8% sales tax
  const totalAmount = subtotal + tax;

  // Validation Logic
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) error = 'Enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\+?[\d\s-]{10,15}$/.test(value)) error = 'Enter a valid 10+ digit phone number';
        break;
      case 'licenseNumber':
        if (!value.trim()) error = "Driver's license number is required";
        else if (value.trim().length < 6) error = 'License number must be at least 6 characters';
        break;
      case 'returnDate':
        if (new Date(value) <= new Date(formData.pickupDate)) {
          error = 'Return date must be after pick-up date';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    if (type !== 'checkbox') {
      const err = validateField(name, val);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const validateAll = () => {
    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      licenseNumber: validateField('licenseNumber', formData.licenseNumber),
      returnDate: validateField('returnDate', formData.returnDate)
    };

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and rental policy';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);

    // Simulate API reservation call
    setTimeout(() => {
      const newBooking = addBooking({
        carId: car.id,
        carMake: car.make,
        carModel: car.model,
        carType: car.type,
        carImage: car.image,
        dailyRate: car.price,
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.returnLocation,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        days: days,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        licenseNumber: formData.licenseNumber,
        insuranceIncluded: formData.includeInsurance,
        gpsIncluded: formData.includeGps,
        extraDriverIncluded: formData.includeExtraDriver,
        totalAmount: totalAmount
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setCreatedBooking(newBooking);
      if (onSuccess) onSuccess(newBooking);
    }, 1200);
  };

  if (isSuccess && createdBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
          Reservation Confirmed
        </span>
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Booking #{createdBooking.id}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Thank you, <strong className="text-slate-800">{createdBooking.customerName}</strong>! Your reservation for the <strong className="text-indigo-600">{car.make} {car.model}</strong> has been secured in our system.
        </p>

        {/* Receipt Summary Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Pick-up:</span>
            <span className="font-semibold text-slate-800">{createdBooking.pickupLocation} ({createdBooking.pickupDate})</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Return:</span>
            <span className="font-semibold text-slate-800">{createdBooking.returnLocation} ({createdBooking.returnDate})</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Rental Duration:</span>
            <span className="font-semibold text-slate-800">{createdBooking.days} Day(s)</span>
          </div>
          <div className="flex justify-between text-sm pt-1">
            <span className="font-bold text-slate-700">Total Paid:</span>
            <span className="font-black text-indigo-600">${createdBooking.totalAmount} USD</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider shadow-md shadow-indigo-100 cursor-pointer"
          >
            View In My Bookings
          </button>
          <button
            onClick={() => navigate('/fleet')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider cursor-pointer"
          >
            Browse More Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
      <div className="mb-8 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full inline-block mb-1 border border-indigo-100">
            Experiment 4: Controlled Form
          </span>
          <h2 className="text-2xl font-black text-slate-900">Rental Reservation Form</h2>
          <p className="text-xs text-slate-500 mt-1">Complete your driver verification and reservation options below.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <img src={car.image} alt={car.model} className="w-16 h-12 object-cover rounded-xl" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{car.make} {car.model}</h4>
            <span className="text-xs font-black text-indigo-600">${car.price}/day</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Itinerary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
              <span>Pickup & Return Itinerary</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pick-up Location</label>
                <select
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  <option value="Downtown Los Angeles Showroom">Downtown LA Showroom</option>
                  <option value="Los Angeles Int. Airport (LAX)">LAX Airport Terminal 4</option>
                  <option value="Beverly Hills Luxury Hub">Beverly Hills Luxury Hub</option>
                  <option value="Santa Monica Pier Lounge">Santa Monica Pier Lounge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Return Location</label>
                <select
                  name="returnLocation"
                  value={formData.returnLocation}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  <option value="Downtown Los Angeles Showroom">Downtown LA Showroom</option>
                  <option value="Los Angeles Int. Airport (LAX)">LAX Airport Terminal 4</option>
                  <option value="Beverly Hills Luxury Hub">Beverly Hills Luxury Hub</option>
                  <option value="Santa Monica Pier Lounge">Santa Monica Pier Lounge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pick-up Date</label>
                <input
                  type="date"
                  name="pickupDate"
                  min={getInitialDates().today}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  min={formData.pickupDate}
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.returnDate ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.returnDate && <p className="text-[11px] text-rose-500 mt-1">{errors.returnDate}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Driver Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
              <span>Driver Credentials & Verification</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Samruddh Jadhav"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.fullName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Driver's License No. *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="DL-9842103"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.licenseNumber ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.licenseNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.licenseNumber}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Add-on Protection & Amenities */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
              <span>Protection & Add-on Services</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeInsurance"
                    checked={formData.includeInsurance}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Zero-Deductible Full Collision Protection</span>
                    <span className="text-[11px] text-slate-500">Covers vehicle damage, theft, and third-party liabilities.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+$15/day</span>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeGps"
                    checked={formData.includeGps}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Dedicated Satellite GPS Navigator</span>
                    <span className="text-[11px] text-slate-500">Live traffic updates and offline emergency navigation.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+$5/day</span>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeExtraDriver"
                    checked={formData.includeExtraDriver}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Additional Authorized Driver</span>
                    <span className="text-[11px] text-slate-500">Authorize a secondary driver on the rental contract.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+$10/day</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Price Summary & Submit */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-28 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200">
              Live Fare Summary
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Vehicle Base Rate ({days} d × ${car.price})</span>
                <span className="font-semibold text-slate-900">${baseRate}</span>
              </div>

              {formData.includeInsurance && (
                <div className="flex justify-between">
                  <span>Full Insurance Protection</span>
                  <span className="font-semibold text-slate-900">+${insuranceCost}</span>
                </div>
              )}

              {formData.includeGps && (
                <div className="flex justify-between">
                  <span>Satellite GPS</span>
                  <span className="font-semibold text-slate-900">+${gpsCost}</span>
                </div>
              )}

              {formData.includeExtraDriver && (
                <div className="flex justify-between">
                  <span>Additional Driver</span>
                  <span className="font-semibold text-slate-900">+${driverCost}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes & Fees (8%)</span>
                <span className="font-semibold text-slate-900">${tax}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-300">
                <span className="text-sm font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-black text-indigo-600">${totalAmount} USD</span>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-3 border-t border-slate-200">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 leading-tight">
                  I agree to the rental terms, verify I am 21+ with a valid license, and authorize the reservation charge.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-[11px] text-rose-500 mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition duration-200 flex items-center justify-center space-x-2 shadow-lg ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Securing Vehicle...</span>
                </>
              ) : (
                <span>Confirm & Reserve (${totalAmount})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
