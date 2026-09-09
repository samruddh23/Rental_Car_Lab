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
        <p className="text-slate-500 text-sm">Retrieving vehicle specifications...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 max-w-md py-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested car ID does not exist in our active fleet database.</p>
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
        <Link to="/fleet" className="hover:text-indigo-600">Our Fleet</Link>
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
              {car.category}
            </div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm">
              <StarIcon />
              <span>{car.rating} ({car.reviews} reviews)</span>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Included Complimentary Features
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Unlimited Mileage</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Apple CarPlay & Android Auto</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Full Tank Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Clean & Sanitized</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>24/7 Roadside Assistance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>Bluetooth & USB-C Ports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Booking Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-2">
                {car.type}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                {car.make} {car.model}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Precision engineering and handcrafted comfort. Inspected by certified technicians prior to every departure.
              </p>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline space-x-2 pb-6 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-900">${car.price}</span>
              <span className="text-sm text-slate-500 font-medium">USD / daily rate</span>
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
                  <span className="text-[10px] text-slate-400 font-medium">Gearbox</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">{car.transmission}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Fuel / Energy</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 truncate">{car.fuel}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Luggage</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">3 Large Bags</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Top Speed</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">155 - 190 mph</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">Doors</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">2 - 4 Doors</span>
                </div>
              </div>
            </div>

            {/* Rental Requirements */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <span className="font-bold block">Rental Eligibility:</span>
              <p className="text-[11px] text-indigo-800/80">
                Driver must be at least 21 years of age with a valid domestic or international license and credit card for security deposit.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate(`/book/${car.id}`)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 text-center cursor-pointer"
              >
                Proceed to Reservation Form &rarr;
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
