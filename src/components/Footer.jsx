import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 px-4 mt-auto">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
              A
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              ApexDrive <span className="text-orange-500 font-bold text-sm">Bharat 🇮🇳</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            India's premier self-drive car rental ecosystem powered by MERN stack architecture. Serving Mumbai, Pune, Delhi NCR, Bengaluru, and Goa.
          </p>
          <div className="flex space-x-3 text-xs text-slate-400">
            <span className="hover:text-white transition cursor-pointer">Twitter</span>
            <span className="hover:text-white transition cursor-pointer">Instagram</span>
            <span className="hover:text-white transition cursor-pointer">LinkedIn</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Indian Fleet Catalog</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Driver Sign In</Link></li>
            <li><Link to="/signup" className="hover:text-white transition">Create Driver Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Top Indian Rentals</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/fleet" className="hover:text-white transition">Mahindra Thar 4x4 Hard Top</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Toyota Fortuner Legender</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Tata Nexon EV Long Range</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Hyundai Creta Panoramic</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Maruti Suzuki Dzire</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm mb-4">Indian Highway Alerts</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Subscribe for seasonal monsoon discounts, Diwali road trip specials, and Fastag updates.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Dhanyavaad! Subscribed to Indian road trip updates.'); }} className="flex">
            <input 
              type="email" 
              required
              placeholder="Enter email address"
              className="bg-slate-800 text-white px-3 py-2 text-xs rounded-l-lg border border-slate-700 focus:outline-none focus:border-indigo-500 w-full"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-r-lg transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ApexDrive Bharat Inc. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <span className="hover:text-white cursor-pointer transition">Terms & 18% GST Policy</span>
          <span className="hover:text-white cursor-pointer transition">Aadhaar & DL Security</span>
          <span className="hover:text-white cursor-pointer transition">Fastag Agreement</span>
        </div>
      </div>
    </footer>
  );
};
