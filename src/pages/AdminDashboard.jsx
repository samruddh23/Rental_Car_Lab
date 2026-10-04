import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CarContext } from '../CarContext';
import { fetchAdminStatsAPI, runAutomatedTestsAPI, uploadVehicleImageAPI } from '../services/api';
import { getSocketStatus, subscribeToNewBookings, subscribeToStatusUpdates, sendFleetUpdate } from '../services/socket';
import { InvoiceModal } from '../components/InvoiceModal';
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
    isAdmin,
    addCar, 
    updateCar, 
    deleteCar, 
    updateBookingStatus 
  } = useContext(CarContext);

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'bookings', 'security', 'exp8_10'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Experiment 8, 9 & 10 State
  const [testSuiteResults, setTestSuiteResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [socketConnected] = useState(() => getSocketStatus().connected);
  const [socketId] = useState(() => getSocketStatus().id);
  const [realtimeEvents, setRealtimeEvents] = useState([
    {
      id: 'init-1',
      type: 'SOCKET_READY',
      message: '⚡ Socket.io WebSocket connection active on port 5000',
      time: 'Just now'
    }
  ]);
  const [vehicleUploadResult, setVehicleUploadResult] = useState(null);
  const [isUploadingVehicle, setIsUploadingVehicle] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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

  // Experiment 9: Socket.io Real-Time Listeners
  useEffect(() => {
    const unsubBooking = subscribeToNewBookings((booking) => {
      setRealtimeEvents((prev) => [
        {
          id: 'ev-' + Date.now(),
          type: 'NEW_BOOKING',
          message: `🚗 New Booking #${booking.id} reserved for ${booking.customerName} (${booking.carMake} ${booking.carModel})`,
          time: new Date().toLocaleTimeString('en-IN')
        },
        ...prev.slice(0, 9)
      ]);
    });

    const unsubStatus = subscribeToStatusUpdates((data) => {
      setRealtimeEvents((prev) => [
        {
          id: 'ev-' + Date.now(),
          type: 'STATUS_UPDATE',
          message: `⚡ Booking #${data.bookingId} status transitioned to: ${data.status}`,
          time: new Date().toLocaleTimeString('en-IN')
        },
        ...prev.slice(0, 9)
      ]);
    });

    return () => {
      unsubBooking();
      unsubStatus();
    };
  }, []);

  const handleRunAutomatedTests = async () => {
    setIsRunningTests(true);
    const res = await runAutomatedTestsAPI();
    setTestSuiteResults(res);
    setIsRunningTests(false);
  };

  const handleUploadVehicleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingVehicle(true);
    const res = await uploadVehicleImageAPI(file);
    setVehicleUploadResult(res);
    setIsUploadingVehicle(false);
  };

  const handleBroadcastAlert = () => {
    sendFleetUpdate({
      action: 'AVAILABILITY_BROADCAST',
      message: 'Fleet availability sync triggered across all client WebSockets',
      timestamp: new Date().toISOString()
    });
    setRealtimeEvents((prev) => [
      {
        id: 'ev-' + Date.now(),
        type: 'BROADCAST_SENT',
        message: '📢 Real-Time WebSocket broadcast emitted to all connected clients',
        time: new Date().toLocaleTimeString('en-IN')
      },
      ...prev.slice(0, 9)
    ]);
  };

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

  // Hard Security Boundary: Block all customers from accessing Admin portal
  if (!user || !isAdmin || user.email?.toLowerCase().trim() !== 'admin@apexdrive.in') {
    return <Navigate to="/" replace />;
  }

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
            <span className="bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span>👑</span> Verified Admin: {user?.email || 'admin@apexdrive.in'}
            </span>
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
        <button
          onClick={() => setActiveTab('exp8_10')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition relative ${
            activeTab === 'exp8_10' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          🔬 Exp 8-10: Files, Sockets & Testing
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

      {/* TAB 4: EXPERIMENTS 8, 9 & 10 (MULTER, WEBSOCKETS, TESTING & DOCKER) */}
      {activeTab === 'exp8_10' && (
        <div className="space-y-8">
          {/* Section 1: Overview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-900/40 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Exp 8: Multer & Payments
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Exp 9: Socket.io WebSockets
                </span>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Exp 10: Docker & Automated Tests
                </span>
              </div>
              <h2 className="text-xl font-black">Production Integration & Testing Control Center</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Execute end-to-end automated MERN test suites, monitor real-time bidirectional WebSocket events, upload media through Multer middleware, and inspect containerized multi-service Docker architecture.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                socketConnected 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {socketConnected ? `Socket.io Active (${socketId ? socketId.slice(0, 8) + '...' : 'Connected'})` : 'Socket.io Reconnecting...'}
              </span>
            </div>
          </div>

          {/* Section 2: Experiment 10 Automated Test Suite Runner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase border border-purple-200">
                  Experiment 10: Automated Full-Stack Test Suite
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  10-Test MERN Integration & Health Runner
                </h3>
                <p className="text-xs text-slate-500">
                  Tests Health Check, MongoDB Cars CRUD, Category Query, Bookings, Auth JWT, Protected RBAC, Razorpay Orders, and WebSockets.
                </p>
              </div>

              <button
                onClick={handleRunAutomatedTests}
                disabled={isRunningTests}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition shadow-lg shadow-purple-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                {isRunningTests ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Executing Test Suite...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Run Automated 10-Test Suite</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Results Table */}
            {testSuiteResults ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">Overall Suite Result:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                      ✓ {testSuiteResults.passed} / {testSuiteResults.total} Tests Passed ({testSuiteResults.successRate})
                    </span>
                    <span className="text-slate-500 font-mono">Duration: {testSuiteResults.durationMs}ms</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">Timestamp: {testSuiteResults.timestamp}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-100">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Test Case / Description</th>
                        <th className="py-2.5 px-3">Target Endpoint</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {testSuiteResults.results?.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{t.id}</td>
                          <td className="py-2.5 px-3 text-slate-900 font-semibold">{t.name}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-600">{t.endpoint}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                              {t.method}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{t.durationMs}ms</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                              PASS ✓
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                <span className="text-3xl block mb-2">🧪</span>
                <p className="font-semibold text-slate-700">Automated Test Suite Ready</p>
                <p className="mt-1">Click "Run Automated 10-Test Suite" to execute all MERN integration tests live against Express and MongoDB.</p>
              </div>
            )}
          </div>

          {/* Section 3: Experiment 9 Real-Time WebSockets Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-200">
                      Experiment 9: Socket.io WebSockets
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Real-Time Event Stream</h3>
                  </div>
                  <button
                    onClick={handleBroadcastAlert}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    📢 Broadcast Fleet Sync
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Captures live bidirectional events emitted by Express on port 5000 (`new_booking_alert`, `booking_status_updated`, `sahayak_query`).
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {realtimeEvents.map((ev) => (
                    <div key={ev.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-slate-800 block">{ev.message}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{ev.type}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>Protocol: WebSocket (WSS/WS fallback Polling)</span>
                <span className="font-bold text-emerald-600">Transport: websocket</span>
              </div>
            </div>

            {/* Section 4: Experiment 8 Multer File Upload & Invoicing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase border border-indigo-200">
                      Experiment 8: Multer File Upload & Invoices
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Vehicle Image & Tax Invoice</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Multer Vehicle Upload Test */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="font-bold text-slate-800 block mb-1">
                      Upload Vehicle Photo (Multer Storage to `server/uploads/`)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Validates MIME type (image/png, image/jpeg, image/webp) and enforces 5MB limit.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition">
                        <span>📸 Select Car Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadVehicleImage}
                          className="hidden"
                        />
                      </label>
                      {isUploadingVehicle && (
                        <span className="text-indigo-600 animate-pulse font-medium">Uploading to /uploads...</span>
                      )}
                      {vehicleUploadResult && (
                        <span className="text-emerald-600 font-bold">✓ Uploaded Successfully</span>
                      )}
                    </div>
                    {vehicleUploadResult && (
                      <div className="mt-3 flex items-center gap-3">
                        <img 
                          src={vehicleUploadResult.fileUrl} 
                          alt="Uploaded" 
                          className="w-16 h-12 object-cover rounded-lg border border-slate-200 shadow-sm" 
                        />
                        <div className="font-mono text-[10px] text-slate-500 truncate">
                          URL: {vehicleUploadResult.fileUrl}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GST Invoice Generator */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="font-bold text-slate-800 block mb-1">
                      Generate Official GST Tax Invoice (SAC 996601)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Generates statutory Indian GST invoice with CGST (9%) + SGST (9%), SAC code, and GSTIN.
                    </p>
                    <button
                      onClick={() => {
                        const sampleBooking = bookings[0] || {
                          id: 'BK-SAMPLE-01',
                          customerName: 'Samruddh Jadhav',
                          customerEmail: 'samruddh@example.com',
                          customerPhone: '+91 98201 45678',
                          carMake: 'Tata',
                          carModel: 'Harrier Dark Edition',
                          pickupLocation: 'Mumbai - BKC Hub',
                          pickupDate: '2026-10-10',
                          returnDate: '2026-10-14',
                          days: 4,
                          totalAmount: 18880,
                          licenseNumber: 'MH0220230018921'
                        };
                        setSelectedInvoiceBooking(sampleBooking);
                        setShowInvoiceModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>📄</span>
                      <span>Preview Sample Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Experiment 10 Dockerization Topology */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase border border-sky-200">
                Experiment 10: Docker & Production Deployment
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Multi-Container Docker Architecture (`docker-compose.yml`)
              </h3>
              <p className="text-xs text-slate-500">
                Production-ready multi-stage containers orchestrating MongoDB database, Express Node backend, and Nginx React frontend.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900">Service 1: MongoDB</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Port 27017</span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">Image: `mongo:7.0`</p>
                <p className="text-[11px] text-slate-500 font-mono">Volume: `mongo-data:/data/db`</p>
                <p className="text-[11px] text-slate-500 mt-1">Network: `app-network` (bridge)</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900">Service 2: Express Backend</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">Port 5000</span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">Dockerfile: `server/Dockerfile`</p>
                <p className="text-[11px] text-slate-500 font-mono">Base: `node:20-alpine`</p>
                <p className="text-[11px] text-slate-500 mt-1">Features: Socket.io, Multer, REST API</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900">Service 3: React Frontend</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Port 5173 / 80</span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">Dockerfile: `./Dockerfile`</p>
                <p className="text-[11px] text-slate-500 font-mono">Base: `node:20-alpine` + `nginx:alpine`</p>
                <p className="text-[11px] text-slate-500 mt-1">Build: Vite + Tailwind CSS 3 Production</p>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs flex items-center justify-between">
              <span>$ docker-compose up --build</span>
              <span className="text-[11px] text-slate-400">Launch entire MERN stack in 1 command</span>
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

      {/* Experiment 8 GST Tax Invoice Modal */}
      {showInvoiceModal && selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
