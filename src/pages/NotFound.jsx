import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="container mx-auto px-4 max-w-md py-32 text-center">
      <span className="text-6xl font-black text-indigo-600 block mb-4">404</span>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-xs text-slate-500 mb-8 leading-relaxed">
        The destination or vehicle path you are looking for has either been moved, decommissioned, or does not exist.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-indigo-100 inline-block"
      >
        Return to Home &rarr;
      </Link>
    </div>
  );
};
