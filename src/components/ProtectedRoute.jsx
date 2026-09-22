import React, { useContext } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { ShieldIcon } from './Icons';

/**
 * ProtectedRoute Component (Experiment 7: Authentication & Authorization Guard)
 * Protects routes from unauthenticated users and restricts admin paths.
 */
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, toggleAdminMode } = useContext(CarContext);
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
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
            <ShieldIcon className="w-8 h-8" />
          </div>
          <span className="text-amber-600 font-bold tracking-widest text-[10px] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block mb-3">
            Experiment 7: Role Authorization Guard
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Administrator Privileges Required
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            You are signed in as <strong>{user.name}</strong> with role: <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-xs uppercase">{user.role}</span>. The Fleet Management Portal is restricted to authorized administrators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={toggleAdminMode}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-indigo-100"
            >
              👑 Switch to Admin Demo Mode
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
