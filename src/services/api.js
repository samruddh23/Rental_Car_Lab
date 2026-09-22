const API_BASE_URL = 'http://localhost:5000/api';

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
