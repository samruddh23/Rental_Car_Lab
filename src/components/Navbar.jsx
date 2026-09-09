import React, { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CarContext } from '../CarContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { bookings } = useContext(CarContext);

  const activeLinkClass = ({ isActive }) => 
    `text-sm font-semibold transition px-3 py-1.5 rounded-lg ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 font-bold' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center h-20">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
            A
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Apex<span className="text-indigo-600">Drive</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (React Router NavLink) */}
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={activeLinkClass}>
            Home
          </NavLink>
          <NavLink to="/fleet" className={activeLinkClass}>
            Our Fleet
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => 
            `relative text-sm font-semibold transition px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
              isActive 
                ? 'text-indigo-600 bg-indigo-50 font-bold' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
            }`
          }>
            <span>My Bookings</span>
            {bookings.length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {bookings.length}
              </span>
            )}
          </NavLink>
        </div>

        {/* Call to Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/fleet"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
          >
            Rent a Car
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-600 hover:text-slate-950 p-2 bg-slate-50 rounded-xl border border-slate-100 transition"
          aria-label="Toggle navigation menu"
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
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2 shadow-lg flex flex-col absolute top-20 left-0 w-full z-40 transition-all">
          <NavLink 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `block px-4 py-2.5 rounded-xl font-semibold text-sm ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/fleet" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `block px-4 py-2.5 rounded-xl font-semibold text-sm ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Our Fleet
          </NavLink>
          <NavLink 
            to="/my-bookings" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <span>My Bookings</span>
            {bookings.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {bookings.length}
              </span>
            )}
          </NavLink>
          <div className="pt-2 border-t border-slate-100">
            <Link 
              to="/fleet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-indigo-600 text-white text-center font-semibold py-3 rounded-xl block text-sm shadow-md shadow-indigo-100"
            >
              Rent a Car
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
