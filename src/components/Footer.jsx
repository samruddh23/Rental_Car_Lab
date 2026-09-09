import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
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
            Elite car rental platform built with modern full-stack MERN technologies, offering premium vehicle leasing with instant reservation confirmation.
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
            <li><Link to="/fleet" className="hover:text-white transition">Fleet Catalog</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Fleet Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/fleet" className="hover:text-white transition">Sports & Supercars</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Luxury SUVs</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Electric & Hybrids</Link></li>
            <li><Link to="/fleet" className="hover:text-white transition">Executive Sedans</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm mb-4">Stay Informed</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Subscribe to get exclusive seasonal discounts and new vehicle fleet announcements.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter!'); }} className="flex">
            <input 
              type="email" 
              required
              placeholder="Enter email address"
              className="bg-slate-800 text-white px-3 py-2 text-xs rounded-l-lg border border-slate-700 focus:outline-none focus:border-indigo-500 w-full"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-r-lg transition">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ApexDrive Inc. Full Stack Development Lab Project.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition">Experiment 1 - 5</span>
        </div>
      </div>
    </footer>
  );
};
