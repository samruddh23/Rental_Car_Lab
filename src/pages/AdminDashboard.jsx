import React, { useContext, useState, useEffect } from 'react';
import { CarContext } from '../CarContext';
import { fetchAdminStatsAPI } from '../services/api';
import { 
  ShieldIcon, 
  CheckCircleIcon, 
  CalendarIcon, 
  CarIcon, 
  IndianRupeeIcon 
} from '../components/Icons';

export const AdminDashboard = () => {
  const { 
    fleet, 
    bookings, 
    user, 
    token, 
    addCar, 
    updateCar, 
    deleteCar, 
    updateBookingStatus, 
    toggleAdminMode 
  } = useContext(CarContext);

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'bookings', 'security'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // New Car Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCarForm, setNewCarForm] = useState({
    make: '',
    model: '',
    type: 'Luxury SUV',
    category: 'suv',
    price: '',
    fuel: 'Diesel',
    transmission: 'Automatic',
    passengers: 5,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
  });
  const [addCarLoading, setAddCarLoading] = useState(false);

  // Quick Price Edit State
  const [editingCarId, setEditingCarId] = useState(null);
  const [newPriceValue, setNewPriceValue] = useState('');

  // Fetch admin stats from MongoDB backend
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      const res = await fetchAdminStatsAPI();
      if (res) {
        setStats(res);
      }
      setStatsLoading(false);
    };
    loadStats();
  }, [fleet.length, bookings.length]);

  const handleCreateCar = async (e) => {
    e.preventDefault();
    if (!newCarForm.make || !newCarForm.model || !newCarForm.price) return;

    setAddCarLoading(true);
    await addCar({
      ...newCarForm,
      price: Number(newCarForm.price),
      passengers: Number(newCarForm.passengers)
    });
    setAddCarLoading(false);
    setShowAddModal(false);
    setNewCarForm({
      make: '',
      model: '',
      type: 'Luxury SUV',
      category: 'suv',
      price: '',
      fuel: 'Diesel',
      transmission: 'Automatic',
      passengers: 5,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
    });
  };

  const handleSavePrice = async (carId) => {
    if (!newPriceValue || isNaN(newPriceValue)) return;
    await updateCar(carId, { price: Number(newPriceValue) });
    setEditingCarId(null);
    setNewPriceValue('');
  };

  const handleToggleAvailability = async (car) => {
    await updateCar(car.id, { available: !car.available });
  };

  const handleDeleteCar = async (carId, carName) => {
    if (window.confirm(`Are you sure you want to remove ${carName} from the MongoDB fleet inventory?`)) {
      await deleteCar(carId);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      {/* Top Banner: Experiment 6 & 7 Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden border border-indigo-900/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Live Database
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Exp 6: Database CRUD
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Exp 7: JWT Auth & RBAC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Executive Fleet Management Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Real-time administrative control panel with full MongoDB persistence, CRUD vehicle management, booking status lifecycle, and JWT authorization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleAdminMode}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              title="Toggle role between Admin and Customer to test Protected Routes"
            >
              🔄 Switch to Customer View
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <span>+</span> Add Vehicle to MongoDB
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fleet Inventory</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{fleet.length} Vehicles</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              ✓ {fleet.filter(c => c.available !== false).length} Available for rent
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <CarIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Bookings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{bookings.length} Orders</h3>
            <p className="text-[11px] text-indigo-600 font-bold mt-1">
              Synced with MongoDB
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{(bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0)).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Incl. 18% GST + FASTag
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <IndianRupeeIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Security State</p>
            <h3 className="text-base font-black text-slate-900 mt-1">JWT Bearer Auth</h3>
            <p className="text-[11px] text-indigo-600 font-mono font-bold mt-1">
              Admin: {user?.name || 'Administrator'}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <ShieldIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition relative ${
            activeTab === 'fleet' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          🚗 Vehicle Inventory (Experiment 6 CRUD)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition relative ${
            activeTab === 'bookings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          📋 Bookings Lifecycle (Exp 4 & 6)
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition relative ${
            activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          🔐 JWT Diagnostics & MongoDB Specs (Exp 7)
        </button>
      </div>

      {/* TAB 1: FLEET CRUD */}
      {activeTab === 'fleet' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Vehicle Catalog (MongoDB Collection: `cars`)</h2>
              <p className="text-xs text-slate-500">Edit daily rental rates, toggle availability, or delete inventory directly from database.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition shadow-md shadow-indigo-100"
            >
              + Add Vehicle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Fuel / Trans</th>
                  <th className="py-4 px-6">Daily Rate (₹)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fleet.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200" 
                        />
                        <div>
                          <p className="font-bold text-slate-900">{car.make} {car.model}</p>
                          <p className="text-[10px] text-slate-400">{car.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                        {car.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-700">{car.fuel}</p>
                      <p className="text-[10px] text-slate-400">{car.transmission}</p>
                    </td>
                    <td className="py-4 px-6">
                      {editingCarId === car.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={newPriceValue}
                            onChange={(e) => setNewPriceValue(e.target.value)}
                            placeholder={car.price.toString()}
                            className="w-20 px-2 py-1 text-xs border border-indigo-400 rounded-lg focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(car.id)}
                            className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCarId(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">₹{car.price.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => {
                              setEditingCarId(car.id);
                              setNewPriceValue(car.price.toString());
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleAvailability(car)}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition ${
                          car.available !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {car.available !== false ? '● Available' : '○ Reserved / Maint'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteCar(car.id, `${car.make} ${car.model}`)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS CRUD */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Customer Reservations (MongoDB Collection: `bookings`)</h2>
            <p className="text-xs text-slate-500">Update reservation progress lifecycle or handle cancellations.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No reservations logged yet. Create a booking through the vehicle catalog!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6">Booking ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Vehicle Reserved</th>
                    <th className="py-4 px-6">Dates & Hub</th>
                    <th className="py-4 px-6">Amount (₹)</th>
                    <th className="py-4 px-6">Status Lifecycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                        {booking.id}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{booking.customerName}</p>
                        <p className="text-[10px] text-slate-400">{booking.customerPhone} • {booking.customerEmail}</p>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {booking.carMake} {booking.carModel}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-800 font-medium">{booking.pickupDate} → {booking.returnDate}</p>
                        <p className="text-[10px] text-slate-400">{booking.pickupLocation}</p>
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">
                        ₹{(Number(booking.totalAmount) || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={booking.status || 'Confirmed'}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-600"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Ongoing">Ongoing (Trip Started)</option>
                          <option value="Completed">Completed (Returned)</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SECURITY & SPECIFICATIONS */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <span className="text-indigo-600 font-bold tracking-widest text-[10px] uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-3">
              Experiment 7: JWT Security
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-2">JWT Authentication Architecture</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              User identity and roles are encrypted in a JSON Web Token signed with HMAC SHA-256. All administrative and reservation routes enforce token validation via the Express `authMiddleware`.
            </p>

            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-[11px] overflow-x-auto mb-4">
              <p className="text-slate-400 mb-1">// Active JWT Bearer Token Header</p>
              <p className="text-emerald-400 break-all">
                Authorization: Bearer {token ? token.slice(0, 48) + '...' : 'No active token'}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span><strong>Role-Based Access Control (RBAC):</strong> Admin vs Customer permissions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span><strong>Password Hashing:</strong> `bcryptjs` salt rounds (10)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span><strong>Protected Client Routes:</strong> Guarded using `ProtectedRoute.jsx`</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <span className="text-emerald-600 font-bold tracking-widest text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-3">
              Experiment 6: Database Topology
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-2">MongoDB & Mongoose Schema</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Database connection established via Mongoose with structured schemas, pre-save hooks, unique indexes, and fallback resilience.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">Database Name:</p>
                <p className="font-mono text-indigo-600">{stats?.database?.name || 'rental_car_db'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">Collections:</p>
                <p className="font-mono text-slate-600">cars (Fleet), bookings (Orders), users (Auth)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">Connection Host & Status:</p>
                <p className="font-mono text-slate-500 text-[11px]">
                  {statsLoading ? 'Pinging database...' : `${stats?.database?.host || '127.0.0.1'} (${stats?.database?.status || 'Active'})`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Car to MongoDB */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-indigo-600 font-bold tracking-widest text-[10px] uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-1">
                  Experiment 6: MongoDB Create Operation
                </span>
                <h3 className="text-xl font-black text-slate-900">Add Vehicle to Fleet</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCar} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Make / Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata, Mahindra"
                    value={newCarForm.make}
                    onChange={(e) => setNewCarForm({ ...newCarForm, make: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safari Dark Edition"
                    value={newCarForm.model}
                    onChange={(e) => setNewCarForm({ ...newCarForm, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category</label>
                  <select
                    value={newCarForm.category}
                    onChange={(e) => setNewCarForm({ ...newCarForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  >
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="electric">Electric</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Daily Rate (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2999"
                    value={newCarForm.price}
                    onChange={(e) => setNewCarForm({ ...newCarForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Transmission</label>
                  <input
                    type="text"
                    value={newCarForm.transmission}
                    onChange={(e) => setNewCarForm({ ...newCarForm, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Fuel Type</label>
                  <input
                    type="text"
                    value={newCarForm.fuel}
                    onChange={(e) => setNewCarForm({ ...newCarForm, fuel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Seats</label>
                  <input
                    type="number"
                    value={newCarForm.passengers}
                    onChange={(e) => setNewCarForm({ ...newCarForm, passengers: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newCarForm.image}
                  onChange={(e) => setNewCarForm({ ...newCarForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addCarLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl uppercase tracking-wider transition shadow-md shadow-indigo-100"
                >
                  {addCarLoading ? 'Inserting into MongoDB...' : 'Save to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
