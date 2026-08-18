import React, { useContext, useState } from 'react';
import { CarProvider, CarContext } from './CarContext';
import { useFetchCars } from './useFetchCars';

// Custom SVG Icons Components for lightweight UI
const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const GearIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FuelIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// Booking Modal Component
const BookingModal = ({ car, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    duration: 3,
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalCost = car.price * formData.duration;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.terms) return;
    setIsSubmitting(true);
    // Simulate booking API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Secure Booking</h3>
            <p className="text-xs text-slate-400">Configure your rental details</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 text-center flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h4>
            <p className="text-slate-600 mb-6">
              Congratulations! Your reservation for the <strong className="text-indigo-600">{car.make} {car.model}</strong> has been secured successfully. Check your email for next steps.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left border border-slate-100 text-sm space-y-2">
              <p><span className="text-slate-500">Customer:</span> <span className="font-semibold text-slate-800">{formData.name}</span></p>
              <p><span className="text-slate-500">Vehicle:</span> <span className="font-semibold text-slate-800">{car.make} {car.model} ({car.type})</span></p>
              <p><span className="text-slate-500">Duration:</span> <span className="font-semibold text-slate-800">{formData.duration} days starting {formData.startDate || 'today'}</span></p>
              <p><span className="text-slate-500">Estimated Fare:</span> <span className="font-semibold text-indigo-600">${totalCost} USD</span></p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition duration-200"
            >
              Back to Home
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* Car Mini Card */}
            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <img src={car.image} alt={`${car.make} ${car.model}`} className="w-20 h-16 object-cover rounded-lg shadow-sm" />
              <div>
                <h4 className="font-bold text-slate-900">{car.make} {car.model}</h4>
                <p className="text-xs text-slate-500">{car.type}</p>
                <p className="text-indigo-600 font-extrabold text-sm mt-1">${car.price}/day</p>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Pick-up Date</label>
              <input 
                type="date" 
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Duration (Days)</label>
                <input 
                  type="number" 
                  name="duration" 
                  min="1" 
                  max="30"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Estimated Cost</label>
                <div className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-base flex items-center h-10 select-none">
                  ${totalCost} USD
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-2" />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                name="terms"
                required
                checked={formData.terms}
                onChange={handleInputChange}
                className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" 
              />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-normal select-none">
                I authorize ApexDrive to reserve this vehicle and agree to the Terms of Service & Rental Agreements.
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !formData.terms}
              className={`w-full text-white font-semibold py-3 rounded-xl transition duration-200 mt-4 flex items-center justify-center space-x-2 ${
                formData.terms ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing Reservation...</span>
                </>
              ) : (
                <span>Confirm Booking Reservation</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Component that displays the fetched fleet using Context and Hooks
const FleetDisplay = ({ onSelectCar }) => {
    // Calling custom hook which uses useEffect
    useFetchCars(); 
    
    // Consuming the global state using useContext
    const { fleet, loading } = useContext(CarContext);

    // Filter, Search, and Sort state management
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');

    // Handle filtering and searching
    const filteredFleet = fleet.filter(car => {
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || car.category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    // Handle sorting
    const sortedFleet = [...filteredFleet].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // Default ordering
    });

    const categories = [
      { id: 'all', label: 'All Fleet' },
      { id: 'sedan', label: 'Sedans' },
      { id: 'suv', label: 'SUVs' },
      { id: 'sports', label: 'Sports' },
      { id: 'electric', label: 'Electric EVs' }
    ];

    // Rendering Skeletons during API fetch delay
    if (loading) {
        return (
          <section id="fleet" className="container mx-auto py-16 px-4 max-w-7xl">
            <div className="flex flex-col items-center mb-12">
              <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse mb-3"></div>
              <div className="h-10 w-64 bg-slate-300 rounded-lg animate-pulse mb-8"></div>
              <div className="flex space-x-2 overflow-x-auto w-full max-w-md justify-center">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-10 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4 space-y-4">
                  <div className="w-full h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-300 rounded w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="flex space-x-2 pt-2 border-t border-slate-100">
                    <div className="h-8 bg-slate-200 rounded-lg flex-1 animate-pulse"></div>
                    <div className="h-8 bg-slate-200 rounded-lg flex-1 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-8 bg-slate-300 rounded w-1/3 animate-pulse"></div>
                    <div className="h-10 bg-slate-300 rounded-lg w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
    }

    return (
        <section id="fleet" className="container mx-auto py-16 px-4 max-w-7xl">
            {/* Fleet Section Header */}
            <div className="text-center mb-12">
              <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block mb-3 border border-indigo-100">
                Premium Collection
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore Our Modern Fleet
              </h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                Luxury vehicles tuned to absolute perfection, equipped with dynamic technology.
              </p>
            </div>

            {/* Filter and Search Bar Container */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-sm mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Category Toggles */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                      activeCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar Input */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, make or type..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 transition"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-600 transition bg-white"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: Highest First</option>
                </select>
              </div>
            </div>

            {/* Empty Search State */}
            {sortedFleet.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">No Vehicles Found</h4>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
                  We couldn't find any vehicles matching your search criteria. Try modifying your filters or search keywords.
                </p>
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSortBy('default'); }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Vehicle Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedFleet.map((car) => (
                  <div 
                    key={car.id} 
                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Visual Container */}
                    <div className="relative h-56 bg-slate-900 overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                      
                      {/* Floating Category Badge */}
                      <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 shadow-sm">
                        {car.category === 'electric' ? '⚡ EV Hybrid' : car.category}
                      </span>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                        <StarIcon />
                        <span>{car.rating}</span>
                      </div>

                      {/* Price Overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-xs text-white/80 block font-medium">Daily Fare</span>
                        <span className="text-2xl font-black">${car.price} <span className="text-sm font-normal text-white/80">/ day</span></span>
                      </div>
                    </div>

                    {/* Meta Specifications */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition duration-150">
                              {car.make} {car.model}
                            </h3>
                            <p className="text-slate-400 text-xs">{car.type}</p>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 py-4 my-4 border-t border-b border-slate-100">
                          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl text-center">
                            <UserIcon />
                            <span className="text-[10px] text-slate-400 font-medium mt-1">Passengers</span>
                            <span className="text-xs text-slate-700 font-semibold">{car.passengers} Seats</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl text-center">
                            <GearIcon />
                            <span className="text-[10px] text-slate-400 font-medium mt-1">Transmission</span>
                            <span className="text-xs text-slate-700 font-semibold">{car.transmission}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl text-center">
                            <FuelIcon />
                            <span className="text-[10px] text-slate-400 font-medium mt-1">Fuel Type</span>
                            <span className="text-xs text-slate-700 font-semibold truncate max-w-full px-1">{car.fuel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Call-to-action details */}
                      <div className="flex items-center justify-between mt-2 pt-2">
                        <div className="text-xs text-slate-400 font-medium">
                          {car.reviews} verified reviews
                        </div>
                        <button 
                          onClick={() => onSelectCar(car)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition duration-200 shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
                        >
                          Rent Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>
    );
};

// Main App Component wrapped in the Context Provider
function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search filter states from Hero form to autofill/scroll
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    // Scroll smoothly to fleet section
    const fleetSection = document.getElementById('fleet');
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CarProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                A
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Apex<span className="text-indigo-600">Drive</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition">Home</a></li>
              <li><a href="#fleet" className="hover:text-indigo-600 transition">Our Fleet</a></li>
              <li><a href="#why-us" className="hover:text-indigo-600 transition">Why Apex</a></li>
              <li><a href="#reviews" className="hover:text-indigo-600 transition">Testimonials</a></li>
            </ul>

            {/* Call to Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#fleet" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition">
                Browse Cars
              </a>
              <a 
                href="#fleet"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-600 hover:text-slate-950 p-2 bg-slate-50 rounded-xl border border-slate-100 transition"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg flex flex-col absolute top-20 left-0 w-full z-40 transition-all">
              <a 
                href="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 text-sm"
              >
                Home
              </a>
              <a 
                href="#fleet" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 text-sm"
              >
                Our Fleet
              </a>
              <a 
                href="#why-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 text-sm"
              >
                Why Apex
              </a>
              <a 
                href="#reviews" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 text-sm"
              >
                Testimonials
              </a>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a 
                  href="#fleet"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-indigo-600 text-white text-center font-semibold py-3 rounded-xl block text-sm"
                >
                  Book Reservation
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <header className="relative bg-slate-900 overflow-hidden text-white pt-20 pb-32 px-4">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container mx-auto max-w-7xl relative z-10 text-center">
            <span className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span>🚀 Premium Fleet Experience</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
              Drive The Future. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Experience the Ultimate Journey.
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed mb-12">
              Discover clean designs, rich capabilities, and premium quality vehicles. Book your dream drive instantly with absolute peace of mind.
            </p>
          </div>
        </header>

        {/* Floating Hero Booking Widget */}
        <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-30">
          <form 
            onSubmit={handleHeroSearch}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1.5">Pick-up Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <select 
                  value={searchLocation} 
                  onChange={(e) => setSearchLocation(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none"
                >
                  <option value="">Select location...</option>
                  <option value="airport">Los Angeles Int. Airport (LAX)</option>
                  <option value="downtown">Downtown Los Angeles</option>
                  <option value="beverly">Beverly Hills Showroom</option>
                  <option value="santamonica">Santa Monica Office</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1.5">Rent Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <input 
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1.5">Car Class</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </span>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none">
                  <option value="any">Any Performance Class</option>
                  <option value="premium">Premium Prestige</option>
                  <option value="eco">Eco Hybrid / EV</option>
                  <option value="sports">High Octane Sports</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 text-xs uppercase tracking-wider h-11 flex items-center justify-center cursor-pointer"
            >
              Search Available Fleet
            </button>
          </form>
        </div>

        {/* Dynamic Vehicles Fleet Section (Consuming State via Hooks) */}
        <FleetDisplay onSelectCar={setSelectedCar} />

        {/* Features / Why Choose Us Section */}
        <section id="why-us" className="bg-slate-900 text-white py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase">Features & Services</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Why Ride With ApexDrive?</h2>
              <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
                We've tailored every feature of our rental structure to offer the smoothest journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Comprehensive Insurance</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Drive with peace of mind. Every vehicle in our fleet is covered with zero deductible collision damage waivers.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">No Hidden Charges</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Honest pricing with transparent breakdowns. What you quote online matches exactly what you pay at checkout.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">24/7 Roadside Assistance</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Our dispatch center is on call 24 hours a day, 7 days a week to support you with mechanical problems or lockouts.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Flexible Drop-offs</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Choose your drop-off terminal dynamically. Alter bookings on the go directly inside our web dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="reviews" className="py-20 bg-slate-50 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block mb-3">
                Reviews
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Our Clients Say</h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                Hear testimonies from premium travelers and regular business drivers alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Exquisite experience! The Porsche 911 was in absolute pristine condition. Pick up was instant. Will definitely use ApexDrive next trip to LA.",
                  author: "Alexander V.",
                  title: "Creative Director"
                },
                {
                  quote: "Outstanding customer service and zero hidden charges. I booked a Tesla Model Y, got it on full charge and ready to roll. Best app interface.",
                  author: "Sarah M.",
                  title: "Tech Entrepreneur"
                },
                {
                  quote: "Reliable, transparent, and high quality. The Range Rover Sport handled family tours beautifully. Drop-off at the airport took less than 2 minutes.",
                  author: "David K.",
                  title: "Investment Partner"
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(n => <StarIcon key={n} />)}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-50">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {t.author.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.author}</h4>
                      <p className="text-xs text-slate-400">{t.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 px-4 mt-auto">
          <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
                  A
                </div>
                <span className="text-lg font-black text-white tracking-tight">
                  ApexDrive
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Elite car rental configurations with instant online reservations, serving luxury vehicles globally.
              </p>
              <div className="flex space-x-3 text-xs">
                <span className="text-slate-500 hover:text-white transition cursor-pointer">Twitter</span>
                <span className="text-slate-500 hover:text-white transition cursor-pointer">Instagram</span>
                <span className="text-slate-500 hover:text-white transition cursor-pointer">LinkedIn</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#fleet" className="hover:text-white transition">Vehicles Fleet</a></li>
                <li><a href="#why-us" className="hover:text-white transition">Company Profile</a></li>
                <li><a href="#reviews" className="hover:text-white transition">Reviews & Ratings</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4">Fleet Categories</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#fleet" className="hover:text-white transition">Prestige Sedans</a></li>
                <li><a href="#fleet" className="hover:text-white transition">Luxury SUVs</a></li>
                <li><a href="#fleet" className="hover:text-white transition">Supercars & Sports</a></li>
                <li><a href="#fleet" className="hover:text-white transition">EVs & Hybrids</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm mb-4">Newsletter</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Subscribe to get special discount rates and new vehicle alerts.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="bg-slate-800 text-white px-3 py-2 text-xs rounded-l-lg border border-slate-700 focus:outline-none focus:border-indigo-500 w-full"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs rounded-r-lg font-semibold transition cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-7xl border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} ApexDrive Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            </div>
          </div>
        </footer>

        {/* Dynamic Interactive Booking Modal */}
        {selectedCar && (
          <BookingModal 
            car={selectedCar} 
            onClose={() => setSelectedCar(null)} 
          />
        )}
      </div>
    </CarProvider>
  );
}

export default App;