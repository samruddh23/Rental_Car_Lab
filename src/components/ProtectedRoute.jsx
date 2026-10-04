import React, { useContext } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { ShieldIcon } from './Icons';

/**
 * ProtectedRoute Component (Experiment 7: Authentication & Authorization Guard)
 * Protects routes from unauthenticated users and restricts admin paths.
 */
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, logout } = useContext(CarContext);
  const location = useLocation();

  // 1. Unauthenticated check
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname, 
          message: 'Please sign in or create an account to access this page.' 
        }} 
        replace 
      />
    );
  }

  // 2. Admin role check
  if (adminOnly && !isAdmin) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-24 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
            <ShieldIcon className="w-8 h-8" />
          </div>
          <span className="text-rose-600 font-bold tracking-widest text-[10px] uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block mb-3">
            Access Denied: Admin Privileges Only
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Administrator Access Required
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            You are signed in as <strong>{user.name}</strong> with role: <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-xs uppercase">{user.role}</span>. 
            Customer accounts do not have access to the Executive Fleet Management Portal. Only the dedicated Admin account (<code className="text-purple-700 font-mono font-bold">admin@apexdrive.in</code>) can view and manage vehicles and administrative controls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              onClick={logout}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-purple-100"
            >
              Sign In with Admin Account
            </Link>
            <Link
              to="/fleet"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
            >
              Browse Fleet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
