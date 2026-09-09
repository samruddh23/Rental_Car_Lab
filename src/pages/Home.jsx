import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { StarIcon, UserIcon, GearIcon, FuelIcon } from '../components/Icons';

export const Home = () => {
  const navigate = useNavigate();
  const { fleet, loading } = useContext(CarContext);

  const featuredCars = fleet.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-slate-900 overflow-hidden text-white pt-24 pb-36 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <span className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <span>🚀 Elite Fleet Experience (Exp 1 - 5)</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Drive The Future. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Experience The Ultimate Journey.
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Book pristine luxury sedans, performance sports cars, and cutting-edge electric crossovers with instant online confirmation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/fleet"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 text-sm uppercase tracking-wider"
            >
              Explore Full Fleet
            </Link>
            <Link
              to="/my-bookings"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition border border-slate-700 text-sm"
            >
              Manage My Bookings
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Search Floating Banner */}
      <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-30 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Pickup Location</label>
            <p className="text-xs font-bold text-slate-800">Downtown LA & Major Airports</p>
          </div>
          <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
            <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Rental Duration</label>
            <p className="text-xs font-bold text-slate-800">Flexible Daily & Weekly Rates</p>
          </div>
          <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
            <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Fleet Categories</label>
            <p className="text-xs font-bold text-slate-800">Sedans, SUVs, Sports, EVs</p>
          </div>
          <button
            onClick={() => navigate('/fleet')}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition text-xs uppercase tracking-wider shadow-md shadow-indigo-100 cursor-pointer"
          >
            Find Vehicles
          </button>
        </div>
      </div>

      {/* Featured Fleet Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-2">
              Featured Selection
            </span>
            <h2 className="text-3xl font-black text-slate-900">Featured Vehicles</h2>
            <p className="text-xs text-slate-500 mt-1">Hand-picked premium choices ready for immediate reservation.</p>
          </div>
          <Link
            to="/fleet"
            className="mt-4 md:mt-0 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center space-x-1"
          >
            <span>View All {fleet.length} Vehicles</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
                <div className="w-full h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-slate-300 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10">
                    {car.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <StarIcon />
                    <span>{car.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-2xl font-black">${car.price}</span>
                    <span className="text-xs text-white/80"> / day</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">{car.type}</p>

                    <div className="grid grid-cols-3 gap-2 py-3 my-3 border-t border-b border-slate-100 text-center">
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
                        <span className="text-[10px] text-slate-600 font-semibold mt-1 truncate max-w-full px-0.5">{car.fuel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/cars/${car.id}`}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition text-center"
                    >
                      View Specs
                    </Link>
                    <Link
                      to={`/book/${car.id}`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition text-center shadow-md shadow-indigo-100"
                    >
                      Rent Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-20 px-4 mb-16">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase">Core Assurances</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Why Rent With ApexDrive?</h2>
            <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
              We eliminate hidden charges and guarantee instant vehicle readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20 font-bold">
                01
              </div>
              <h3 className="font-bold text-lg mb-2">Zero Deductible Damage Waiver</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Enjoy hassle-free journeys with our comprehensive coverage included on all verified bookings.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20 font-bold">
                02
              </div>
              <h3 className="font-bold text-lg mb-2">No Hidden Fees Guarantee</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The price you calculate in our interactive reservation form is exactly what you pay at checkout.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20 font-bold">
                03
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Roadside VIP Concierge</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Round-the-clock emergency support, battery jumps, and roadside recovery across all service locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto max-w-7xl px-4 mb-24">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-2">
            Verified Experiences
          </span>
          <h2 className="text-3xl font-black text-slate-900">Loved by Drivers Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The Porsche 911 was in showroom condition. The reservation process took less than 60 seconds with instant confirmation.",
              author: "Alexander V.",
              role: "Design Director"
            },
            {
              quote: "Booked an Audi e-tron GT for an executive business tour. Incredible performance and smooth drop-off at LAX terminal.",
              author: "Elena Rostova",
              role: "Tech Founder"
            },
            {
              quote: "Transparent pricing with no hidden airport surcharges. Our family trip in the Range Rover Sport was unforgettable.",
              author: "David K.",
              role: "Management Consultant"
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(n => <StarIcon key={n} />)}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed italic">"{t.quote}"</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">{t.author}</h4>
                <p className="text-[10px] text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
