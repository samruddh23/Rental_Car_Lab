import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { StarIcon, UserIcon, GearIcon, FuelIcon } from '../components/Icons';

export const Fleet = () => {
  const { fleet, loading } = useContext(CarContext);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const categories = [
    { id: 'all', label: 'All Fleet' },
    { id: 'sports', label: 'Sports & Performance' },
    { id: 'suv', label: 'SUVs & Offroad' },
    { id: 'sedan', label: 'Executive Sedans' },
    { id: 'electric', label: 'Electric & Hybrid' }
  ];

  const filteredFleet = fleet.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || car.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFleet = [...filteredFleet].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-2">
          Vehicle Catalog
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900">Explore Our Complete Fleet</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Browse through our modern inventory, filter by category or specs, and reserve your dream car in seconds.
        </p>
      </div>

      {/* Control Bar: Categories, Search, Sort */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-sm mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
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
              placeholder="Search make or model..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-600 transition"
          >
            <option value="default">Sort: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest First</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
              <div className="w-full h-52 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-slate-300 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : sortedFleet.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Vehicles Found</h3>
          <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting another category.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSortBy('default'); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedFleet.map((car) => (
            <div
              key={car.id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Banner */}
              <div className="relative h-56 bg-slate-900 overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>

                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10">
                  {car.category === 'electric' ? '⚡ EV' : car.category}
                </span>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                  <StarIcon />
                  <span>{car.rating}</span>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-2xl font-black">${car.price}</span>
                  <span className="text-xs text-white/80"> / day</span>
                </div>
              </div>

              {/* Specs & Actions */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">{car.type}</p>

                  <div className="grid grid-cols-3 gap-2 py-4 my-4 border-t border-b border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                      <UserIcon />
                      <span className="text-[10px] text-slate-600 font-semibold mt-1">{car.passengers} Seats</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                      <GearIcon />
                      <span className="text-[10px] text-slate-600 font-semibold mt-1">{car.transmission}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                      <FuelIcon />
                      <span className="text-[10px] text-slate-600 font-semibold mt-1 truncate max-w-full px-1">{car.fuel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/cars/${car.id}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition text-center uppercase tracking-wider"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/book/${car.id}`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition text-center uppercase tracking-wider shadow-md shadow-indigo-100"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
