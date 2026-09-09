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
  const { addBooking, user } = useContext(CarContext);

  // Form State (Controlled Components)
  const [formData, setFormData] = useState(() => {
    const { today, tomorrow } = getInitialDates();
    return {
      pickupLocation: 'Mumbai - Chhatrapati Shivaji Maharaj Airport (T2)',
      returnLocation: 'Mumbai - Chhatrapati Shivaji Maharaj Airport (T2)',
      pickupDate: today,
      returnDate: tomorrow,
      fullName: user ? user.name : '',
      email: user ? user.email : '',
      phone: user && user.phone ? user.phone.replace('+91', '').trim() : '',
      licenseNumber: '',
      aadhaarNumber: '',
      includeInsurance: true,
      includeFastag: true,
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

  // Price Calculation Breakdown (INR ₹ and 18% GST)
  const baseRate = car.price * days;
  const insuranceCost = formData.includeInsurance ? 299 * days : 0; // ₹299/day Bumper-to-Bumper
  const fastagCost = formData.includeFastag ? 250 : 0; // ₹250 flat Fastag pass
  const driverCost = formData.includeExtraDriver ? 400 * days : 0; // ₹400/day secondary driver
  const addOnsTotal = insuranceCost + fastagCost + driverCost;
  const subtotal = baseRate + addOnsTotal;
  
  // 18% GST (CGST 9% + SGST 9%)
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const totalGst = cgst + sgst;
  const totalAmount = subtotal + totalGst;

  // Validation Logic
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full legal name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) error = 'Enter a valid email address';
        break;
      case 'phone': {
        const clean = value.replace(/\D/g, '');
        if (!clean) error = '10-digit Indian mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(clean)) error = 'Enter a valid 10-digit mobile number starting with 6-9';
        break;
      }
      case 'licenseNumber':
        if (!value.trim()) error = "Indian Driving License number is required";
        else if (value.trim().length < 8) error = 'Enter a valid DL number (e.g. MH0120230012345)';
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
      newErrors.agreeTerms = 'You must agree to the Indian self-drive rental terms';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);

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
        customerPhone: `+91 ${formData.phone}`,
        licenseNumber: formData.licenseNumber,
        aadhaarNumber: formData.aadhaarNumber,
        insuranceIncluded: formData.includeInsurance,
        fastagIncluded: formData.includeFastag,
        extraDriverIncluded: formData.includeExtraDriver,
        subtotal: subtotal,
        gstAmount: totalGst,
        totalAmount: totalAmount
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setCreatedBooking(newBooking);
      if (onSuccess) onSuccess(newBooking);
    }, 1000);
  };

  const indianHubs = [
    'Mumbai - Chhatrapati Shivaji Maharaj Airport (T2)',
    'Mumbai - Bandra Kurla Complex (BKC)',
    'Mumbai - Dadar TT Circle',
    'Pune - Hinjawadi IT Park Phase 1',
    'Pune - Koregaon Park Hub',
    'Delhi NCR - IGI Airport Terminal 3',
    'Delhi NCR - Cyber Hub Gurugram',
    'Bengaluru - Kempegowda Int. Airport',
    'Bengaluru - Koramangala 5th Block',
    'Goa - Mopa International Airport',
    'Goa - Candolim Beach Center'
  ];

  if (isSuccess && createdBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
          Trip Confirmed
        </span>
        <h3 className="text-2xl font-black text-slate-900 mb-1">
          Booking #{createdBooking.id}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Dhanyavaad, <strong className="text-slate-800">{createdBooking.customerName}</strong>! Your <strong className="text-indigo-600">{car.make} {car.model}</strong> is confirmed. A copy of the booking receipt has been sent to your email.
        </p>

        {/* GST Invoice Receipt */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Pick-up Hub:</span>
            <span className="font-semibold text-slate-800 truncate max-w-xs">{createdBooking.pickupLocation}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Trip Dates:</span>
            <span className="font-semibold text-slate-800">{createdBooking.pickupDate} to {createdBooking.returnDate} ({createdBooking.days} Days)</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Driver Phone:</span>
            <span className="font-semibold text-slate-800">{createdBooking.customerPhone}</span>
          </div>
          <div className="flex justify-between text-sm pt-1">
            <span className="font-bold text-slate-700">Total (Inc. 18% GST):</span>
            <span className="font-black text-indigo-600">₹{createdBooking.totalAmount.toLocaleString('en-IN')} INR</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider shadow-md cursor-pointer"
          >
            Go To My Bookings
          </button>
          <button
            onClick={() => navigate('/fleet')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider cursor-pointer"
          >
            Explore More Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
      <div className="mb-8 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase bg-orange-50 px-3 py-1 rounded-full inline-block mb-1 border border-orange-200">
            🇮🇳 Self-Drive Reservation
          </span>
          <h2 className="text-2xl font-black text-slate-900">Book {car.make} {car.model}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Authorized vehicle rental with Fastag and pan-India roadside assistance.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <img src={car.image} alt={car.model} className="w-16 h-12 object-cover rounded-xl shadow-sm" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{car.make} {car.model}</h4>
            <span className="text-xs font-black text-indigo-600">₹{car.price.toLocaleString('en-IN')}/day</span>
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
              <span>Pickup & Return Hub (India)</span>
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
                  {indianHubs.map((hub, idx) => (
                    <option key={idx} value={hub}>{hub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Drop-off Location</label>
                <select
                  name="returnLocation"
                  value={formData.returnLocation}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  {indianHubs.map((hub, idx) => (
                    <option key={idx} value={hub}>{hub}</option>
                  ))}
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

          {/* Section 2: Driver Verification */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
              <span>Driver Identity & Verification</span>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Number (India) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="98201 45678"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                      errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Driving License Number (India) *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="e.g. MH0120230012345"
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

          {/* Section 3: Add-on Protection & Fastag */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
              <span>Indian Highway & Protection Add-ons</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeFastag"
                    checked={formData.includeFastag}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Pre-Activated FASTag Highway Toll Pass</span>
                    <span className="text-[11px] text-slate-500">Zip through all NHAI highway plazas without stopping.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+₹250 flat</span>
              </label>

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
                    <span className="text-xs font-bold text-slate-900 block">Zero-Deductible Bumper-to-Bumper Insurance</span>
                    <span className="text-[11px] text-slate-500">100% cover on bumper damages, scratch repairs, and third party liabilities.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+₹299/day</span>
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
                    <span className="text-xs font-bold text-slate-900 block">Secondary Driver Authorization</span>
                    <span className="text-[11px] text-slate-500">Add an authorized friend or family driver to the rental contract.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+₹400/day</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Price Summary & GST */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-28 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200">
              Tax Invoice Estimate
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Rate ({days} d × ₹{car.price.toLocaleString('en-IN')})</span>
                <span className="font-semibold text-slate-900">₹{baseRate.toLocaleString('en-IN')}</span>
              </div>

              {formData.includeFastag && (
                <div className="flex justify-between">
                  <span>FASTag Toll Pass</span>
                  <span className="font-semibold text-slate-900">+₹{fastagCost}</span>
                </div>
              )}

              {formData.includeInsurance && (
                <div className="flex justify-between">
                  <span>Zero-Dep Insurance ({days} d)</span>
                  <span className="font-semibold text-slate-900">+₹{insuranceCost.toLocaleString('en-IN')}</span>
                </div>
              )}

              {formData.includeExtraDriver && (
                <div className="flex justify-between">
                  <span>Secondary Driver</span>
                  <span className="font-semibold text-slate-900">+₹{driverCost.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span>Taxable Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>CGST (9%)</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>SGST (9%)</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-300">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-indigo-600">₹{totalAmount.toLocaleString('en-IN')}</span>
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
                  I agree to the Indian Self-Drive Terms, verify my Driving License is valid, and agree to speed limits.
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
                  <span>Reserving Vehicle...</span>
                </>
              ) : (
                <span>Confirm & Reserve (₹{totalAmount.toLocaleString('en-IN')})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
