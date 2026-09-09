import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { CheckCircleIcon, CalendarIcon, MapPinIcon } from '../components/Icons';

export const MyBookings = () => {
  const { bookings, cancelBooking } = useContext(CarContext);
  const [cancelModalId, setCancelModalId] = useState(null);

  const handleCancel = (id) => {
    cancelBooking(id);
    setCancelModalId(null);
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
        <div>
          <span className="text-orange-600 font-bold tracking-widest text-xs uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block mb-2">
            🇮🇳 Trip Reservations
          </span>
          <h1 className="text-3xl font-black text-slate-900">My Rental Bookings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your active road trips, GST tax invoices, and FASTag toll passes.
          </p>
        </div>
        <Link
          to="/fleet"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-indigo-100 text-center"
        >
          Book Another Car
        </Link>
      </div>

      {/* Bookings List or Empty State */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Reservations</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
            You don't have any scheduled Indian road trips right now. Choose from our Thar, Fortuner, or Nexon EV fleet!
          </p>
          <Link
            to="/fleet"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition inline-block shadow-md shadow-indigo-100"
          >
            Explore Indian Fleet (₹)
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Car Image and Basic Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={booking.carImage}
                  alt={`${booking.carMake} ${booking.carModel}`}
                  className="w-24 h-20 object-cover rounded-xl shadow-sm border border-slate-100"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {booking.id}
                    </span>
                    <span className="flex items-center space-x-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>{booking.status}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {booking.carMake} {booking.carModel}
                  </h3>
                  <p className="text-xs text-slate-400">{booking.carType}</p>
                </div>
              </div>

              {/* Trip Dates & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 w-full md:w-auto">
                <div>
                  <div className="flex items-center space-x-1 text-slate-400 font-medium text-[10px] uppercase">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Duration ({booking.days} days)</span>
                  </div>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {booking.pickupDate} &rarr; {booking.returnDate}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-1 text-slate-400 font-medium text-[10px] uppercase">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span>Pick-up Hub</span>
                  </div>
                  <p className="font-semibold text-slate-800 mt-0.5 truncate max-w-xs">
                    {booking.pickupLocation}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Total (Inc. 18% GST)</span>
                  <span className="text-xl font-black text-slate-900">₹{booking.totalAmount.toLocaleString('en-IN')} INR</span>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => setCancelModalId(booking.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Cancel */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Cancel Reservation?</h4>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to cancel booking <strong className="text-slate-800">#{cancelModalId}</strong>? 100% refund will be processed within 24 hours.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(cancelModalId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
