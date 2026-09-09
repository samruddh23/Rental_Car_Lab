import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { BookingForm } from '../components/BookingForm';

export const BookingPage = () => {
  const { id } = useParams();
  const { fleet, loading } = useContext(CarContext);

  const car = fleet.find(c => c.id === parseInt(id, 10));

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Preparing reservation details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 max-w-md py-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">Please select an available car from the fleet catalog to start booking.</p>
        <Link
          to="/fleet"
          className="bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider inline-block"
        >
          Explore Available Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-8">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/fleet" className="hover:text-indigo-600">Fleet</Link>
        <span>/</span>
        <Link to={`/cars/${car.id}`} className="hover:text-indigo-600">{car.make} {car.model}</Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">Reservation Form</span>
      </nav>

      {/* Booking Form Integration (Experiment 4) */}
      <BookingForm car={car} />
    </div>
  );
};
