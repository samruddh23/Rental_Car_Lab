import React, { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CarContext } from '../CarContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { bookings, user, logout } = useContext(CarContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeLinkClass = ({ isActive }) => 
    `text-sm font-semibold transition px-3 py-1.5 rounded-lg ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 font-bold' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center h-20">
        {/* Brand Logo with Indian Flag Motif */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
            A
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Apex<span className="text-indigo-600">Drive</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded">
                Bharat 🇮🇳
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Self-Drive Rentals Across India</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
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
          <NavLink to="/admin" className={({ isActive }) => 
            `text-sm font-semibold transition px-3 py-1.5 rounded-lg flex items-center space-x-1 ${
              isActive 
                ? 'text-purple-600 bg-purple-50 font-bold border border-purple-200' 
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            }`
          }>
            <span>Admin Portal</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-black">
              Exp 6-7
            </span>
          </NavLink>
        </div>

        {/* User Authentication Status or CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 pl-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium leading-none">
                  {user.role === 'admin' ? '👑 Admin' : 'Customer'} • Namaste 🙏
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight block">{user.name}</span>
              </div>
              <div className={`w-8 h-8 ${user.role === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'} text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-sm`}>
                {user.avatar || 'IN'}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-slate-400 hover:text-rose-600 p-1.5 transition rounded-lg hover:bg-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login"
                className="text-slate-700 hover:text-indigo-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-100"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link 
            to="/fleet"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Rent Car
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
          {user && (
            <div className="p-3 bg-indigo-50 rounded-xl flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                  {user.avatar || 'IN'}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Namaste, {user.name} 🙏</span>
                  <span className="text-[10px] text-slate-500">{user.email}</span>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="text-xs text-rose-600 font-bold px-2 py-1 bg-white rounded-lg shadow-sm"
              >
                Logout
              </button>
            </div>
          )}

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
          <NavLink 
            to="/admin" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm ${isActive ? 'bg-purple-50 text-purple-700' : 'text-purple-600 hover:bg-purple-50'}`}
          >
            <span>👑 Admin Portal</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black">
              Exp 6 & 7
            </span>
          </NavLink>

          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center font-semibold py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center font-semibold py-2.5 rounded-xl bg-indigo-600 text-white text-xs shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link 
              to="/fleet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-slate-900 text-white text-center font-semibold py-3 rounded-xl block text-sm shadow-md"
            >
              Browse Indian Fleet
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
