import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { StarIcon, CheckCircleIcon } from '../components/Icons';

export const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fleet, loading } = useContext(CarContext);

  const car = fleet.find(c => c.id === parseInt(id, 10));

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Retrieving Indian vehicle specifications...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 max-w-md py-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested car ID does not exist in our active Indian fleet inventory.</p>
        <Link
          to="/fleet"
          className="bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider inline-block shadow-md shadow-indigo-100"
        >
          Back To Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-8">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/fleet" className="hover:text-indigo-600">Indian Fleet</Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">{car.make} {car.model}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Column: Visuals & Highlights */}
        <div className="space-y-6">
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-100">
            <img
              src={car.image}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/10">
              {car.category === 'electric' ? '⚡ Electric EV' : car.category}
            </div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm">
              <StarIcon />
              <span>{car.rating} ({car.reviews} Indian road reviews)</span>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Included Indian Road Trip Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Pre-fitted FASTag Pass</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>All India Tourism Permit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>High Ground Clearance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Clean & Sanitized Cabin</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>24/7 Pan-India RSA</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Zero Security Deposit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Booking Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block mb-2">
                {car.type}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                {car.make} {car.model}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tuned for Indian highways, ghat ascents, and city traffic. Inspected and sanitized prior to every departure.
              </p>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline space-x-2 pb-6 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-900">₹{car.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-slate-500 font-medium">INR / daily tariff (excl. 18% GST)</span>
            </div>

            {/* Technical Specifications Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Vehicle Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Capacity</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">{car.passengers} Passengers</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Transmission</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 truncate">{car.transmission}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Fuel / Battery</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 truncate">{car.fuel}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Boot Space</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">3-4 Strolley Bags</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Permit</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">All India Tourist</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Airbags</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">6 Airbags (Safety)</span>
                </div>
              </div>
            </div>

            {/* Indian Rental Requirements */}
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 text-xs text-orange-950 space-y-1">
              <span className="font-bold block">Self-Drive Requirements (India):</span>
              <p className="text-[11px] text-orange-800/80">
                Driver must be at least 21 years of age with an original Indian Driving License and Aadhaar card verification.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate(`/book/${car.id}`)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 text-center cursor-pointer"
              >
                Book This Vehicle &rarr;
              </button>
              <button
                onClick={() => navigate('/fleet')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Back To Fleet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
