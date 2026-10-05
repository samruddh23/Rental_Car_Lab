const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? '/api' 
    : 'http://localhost:5000/api');

/**
 * Get JWT Authorization header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('apexdrive_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * -------------------------------------------------------------
 * VEHICLE FLEET CRUD (Experiment 5 & Experiment 6: MongoDB)
 * -------------------------------------------------------------
 */

/**
 * Read: Fetch cars with optional category and search filters
 */
export const fetchCarsFromAPI = async (category = 'all', search = '') => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/cars?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Backend API unavailable, falling back to local dataset:', error.message);
    return null;
  }
};

/**
 * Create: Add a new vehicle to MongoDB inventory (Experiment 6 CRUD Create)
 */
export const createCarAPI = async (carData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(carData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Error adding car to MongoDB:', error.message);
    return null;
  }
};

/**
 * Update: Modify vehicle details (price, availability) in MongoDB (Experiment 6 CRUD Update)
 */
export const updateCarAPI = async (carId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Error updating car in MongoDB:', error.message);
    return null;
  }
};

/**
 * Delete: Remove a vehicle from MongoDB fleet (Experiment 6 CRUD Delete)
 */
export const deleteCarAPI = async (carId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Error deleting car from MongoDB:', error.message);
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * RESERVATION BOOKINGS CRUD (Experiment 4, 5 & 6)
 * -------------------------------------------------------------
 */

/**
 * Read: Fetch all bookings from MongoDB
 */
export const fetchBookingsFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Error fetching bookings from MongoDB:', error.message);
    return null;
  }
};

/**
 * Create: Create a new booking reservation in MongoDB
 */
export const createBookingAPI = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Backend API booking unavailable, using local context state:', error.message);
    return null;
  }
};

/**
 * Update: Update reservation status (Confirmed, Ongoing, Completed, Cancelled)
 */
export const updateBookingStatusAPI = async (bookingId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Error updating booking status in MongoDB:', error.message);
    return null;
  }
};

/**
 * Delete: Cancel a booking via REST API
 */
export const cancelBookingAPI = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API cancellation unavailable, using local context state:', error.message);
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * AUTHENTICATION & SECURITY (Experiment 7: JWT Tokens & Roles)
 * -------------------------------------------------------------
 */

/**
 * User login via REST API with JWT token response
 */
export const loginAPI = async (emailOrPhone, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrPhone, password })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Login failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('apexdrive_token', data.token);
    }
    return { user: data.user, token: data.token };
  } catch (error) {
    console.warn('Backend Auth login error, falling back to client-side auth:', error.message);
    return null;
  }
};

/**
 * User registration via REST API with JWT token response
 */
export const signupAPI = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Registration failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('apexdrive_token', data.token);
    }
    return { user: data.user, token: data.token };
  } catch (error) {
    console.warn('Backend Auth signup error, falling back to client-side auth:', error.message);
    return null;
  }
};

/**
 * Verify current JWT token & get user profile (Protected route)
 */
export const getMeAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`Session expired (${response.status})`);
    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * ADMIN DASHBOARD ANALYTICS (Experiment 6 & 7)
 * -------------------------------------------------------------
 */
export const fetchAdminStatsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.warn('Error fetching admin stats:', error.message);
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * FEATURE 2: ADMIN & SUPER ADMIN RBAC API CLIENTS
 * -------------------------------------------------------------
 */

/**
 * Fetch all registered customers (Admin & Super Admin)
 */
export const fetchCustomersAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.customers || [];
  } catch (error) {
    console.warn('Error fetching customers from API:', error.message);
    // Fallback customers from localStorage / defaults
    return [
      {
        id: 'USR-CUST-01',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+91 98201 12345',
        city: 'Mumbai',
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'USR-CUST-02',
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        phone: '+91 98202 67890',
        city: 'Bengaluru',
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
  }
};

/**
 * Delete a specific customer account (Admin & Super Admin)
 */
export const deleteCustomerAPI = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${customerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete customer');
    }
    return await response.json();
  } catch (error) {
    console.warn('Error deleting customer via API:', error.message);
    return { success: true, simulated: true };
  }
};

/**
 * Disable/Ban or Reactivate a customer account (Admin & Super Admin)
 */
export const toggleCustomerStatusAPI = async (customerId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${customerId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update customer status');
    }
    return await response.json();
  } catch (error) {
    console.warn('Error updating customer status via API:', error.message);
    return { success: true, simulated: true };
  }
};

/**
 * Fetch all Admin and Super Admin accounts (Super Admin Only)
 */
export const fetchAdminsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.admins || [];
  } catch (error) {
    console.warn('Error fetching admins from API:', error.message);
    return [
      {
        id: 'USR-SUPERADMIN-01',
        name: 'ApexDrive Super Admin',
        email: 'superadmin@apexdrive.in',
        phone: '+91 98200 99999',
        city: 'Mumbai',
        role: 'super_admin',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'USR-ADMIN-01',
        name: 'ApexDrive Administrator',
        email: 'admin@apexdrive.in',
        phone: '+91 98200 00000',
        city: 'Mumbai',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
  }
};

/**
 * Create a new Administrator account (Super Admin Only)
 */
export const createAdminAPI = async (adminData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/create-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create admin');
    }
    return await response.json();
  } catch (error) {
    console.warn('Error creating admin via API:', error.message);
    return {
      success: true,
      message: `Admin account simulated for ${adminData.email}`,
      admin: {
        id: 'USR-ADMIN-LOCAL-' + Date.now().toString().slice(-4),
        name: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone || '+91 98200 00000',
        city: adminData.city || 'Mumbai',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    };
  }
};

/**
 * Promote a customer to Admin or revert (Super Admin Only)
 */
export const promoteUserToAdminAPI = async (userId, role = 'admin') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/promote`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update user role');
    }
    return await response.json();
  } catch (error) {
    console.warn('Error promoting user via API:', error.message);
    return { success: true, simulated: true };
  }
};

/**
 * -------------------------------------------------------------
 * EXPERIMENT 8: FILE UPLOAD (MULTER) & PAYMENT GATEWAY
 * -------------------------------------------------------------
 */

/**
 * Upload Identity Document (Driving License / Aadhaar) via Multer
 */
export const uploadDocumentAPI = async (file, documentType = 'Driving License') => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const token = localStorage.getItem('apexdrive_token');
    const response = await fetch(`${API_BASE_URL}/upload/document`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'File upload failed');
    }
    return await response.json();
  } catch (error) {
    console.warn('Document upload error:', error.message);
    return {
      success: true,
      file: {
        filename: file.name,
        originalName: file.name,
        size: file.size,
        fileUrl: URL.createObjectURL(file)
      },
      documentId: 'DOC-LOCAL-' + Date.now().toString().slice(-6),
      documentType,
      message: 'Document uploaded successfully (local fallback preview)'
    };
  }
};

/**
 * Upload Vehicle Image via Multer
 */
export const uploadVehicleImageAPI = async (file) => {
  try {
    const formData = new FormData();
    formData.append('vehicleImage', file);

    const token = localStorage.getItem('apexdrive_token');
    const response = await fetch(`${API_BASE_URL}/upload/vehicle`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Vehicle image upload failed');
    }
    return await response.json();
  } catch (error) {
    console.warn('Vehicle upload error:', error.message);
    return {
      success: true,
      fileUrl: URL.createObjectURL(file),
      message: 'Vehicle image uploaded (fallback preview)'
    };
  }
};

/**
 * Create Payment Order (Razorpay / UPI simulation)
 */
export const createPaymentOrderAPI = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Payment order creation error:', error.message);
    return {
      success: true,
      order: {
        orderId: 'order_test_' + Date.now(),
        amount: (orderData.amount || 5000) * 100,
        currency: 'INR',
        carName: orderData.carName,
        method: orderData.paymentMethod || 'UPI'
      }
    };
  }
};

/**
 * Verify Payment Transaction
 */
export const verifyPaymentAPI = async (verificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(verificationData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Payment verification error:', error.message);
    return {
      success: true,
      transactionId: 'TXN_TEST_' + Date.now().toString().slice(-8),
      status: 'PAID',
      paymentMethod: verificationData.paymentMethod || 'UPI'
    };
  }
};

/**
 * Fetch GST Tax Invoice
 */
export const fetchInvoiceAPI = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/invoice/${bookingId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Error fetching invoice:', error.message);
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * EXPERIMENT 10: AUTOMATED TEST SUITE RUNNER
 * -------------------------------------------------------------
 */
export const runAutomatedTestsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/run`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Test runner API error:', error.message);
    return null;
  }
};

