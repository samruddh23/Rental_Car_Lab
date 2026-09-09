import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarProvider } from './CarContext';
import { useFetchCars } from './useFetchCars';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Fleet } from './pages/Fleet';
import { CarDetails } from './pages/CarDetails';
import { BookingPage } from './pages/BookingPage';
import { MyBookings } from './pages/MyBookings';
import { NotFound } from './pages/NotFound';

// App Content Component where custom hook runs inside CarProvider
const AppContent = () => {
  // Call custom hook (Experiment 2 & 5: fetch fleet from API/context)
  useFetchCars();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Academic Experiment Status Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white text-[11px] font-medium py-1.5 px-4 text-center">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <span>🚗 <strong>MERN Car Rental System</strong> — Experiments 1 to 5 Fully Configured</span>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 1: UI</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 2: Hooks</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 3: SPA Router</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 4: Form Validation</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Exp 5: REST API</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Experiment 1 & 3) */}
      <Navbar />

      {/* Main Routed Page Content (Experiment 3) */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
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