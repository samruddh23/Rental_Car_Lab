import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CarContext } from '../CarContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(CarContext);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/fleet';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Please enter your email/mobile number and password');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      login(emailOrPhone, password);
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('samruddh.jadhav@ves.ac.in', 'demo1234');
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="container mx-auto px-4 max-w-md py-16">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-indigo-600 font-bold tracking-widest text-[10px] uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-2">
            Secure Authentication
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            Namaste! Welcome Back 🙏
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your bookings, Fastag toll passes, and saved Indian rentals.
          </p>
        </div>

        {/* Demo Login Quick CTA */}
        <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-900">Quick Academic Testing?</p>
            <p className="text-[10px] text-amber-700">Pre-fill Samruddh Jadhav's verified account</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer whitespace-nowrap"
          >
            1-Click Demo Login
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center space-x-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email or 10-Digit Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. 9820145678 or user@domain.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-slate-600">Remember on this device</span>
            </label>
            <span className="text-indigo-600 hover:underline cursor-pointer">Forgot PIN?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging In...</span>
              </>
            ) : (
              <span>Sign In to Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an ApexDrive account yet?{' '}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Create Free Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
