import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarProvider } from './CarContext';
import { useFetchCars } from './useFetchCars';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Fleet } from './pages/Fleet';
import { CarDetails } from './pages/CarDetails';
import { BookingPage } from './pages/BookingPage';
import { MyBookings } from './pages/MyBookings';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';

// App Content Component where custom hook runs inside CarProvider
const AppContent = () => {
  // Call custom hook (Experiment 2 & 5: fetch fleet from API/context)
  useFetchCars();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Indian Academic & System Status Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-indigo-600 to-emerald-700 text-white text-[11px] font-medium py-1.5 px-4 text-center">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <span>🇮🇳 <strong>ApexDrive Bharat</strong> — Full Stack MERN Platform (Exp 1 - 7 Complete)</span>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 6: MongoDB CRUD</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 7: JWT Security</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">₹ INR Pricing</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">FASTag Enabled</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Experiment 1, 3, 6 & 7) */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes (Experiment 7: Authentication Guard) */}
          <Route 
            path="/book/:id" 
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Management Dashboard (Experiment 6 & 7: MongoDB CRUD + Admin Role RBAC) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Main App Component with Context & Router Wrappers
function App() {
  return (
    <CarProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CarProvider>
  );
}

export default App;