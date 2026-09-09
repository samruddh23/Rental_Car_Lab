const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch cars from Express REST API with graceful offline fallback
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
    return null; // Signals fallback to mock data
  }
};

/**
 * Create a new booking via REST API
 */
export const createBookingAPI = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
 * Cancel a booking via REST API
 */
export const cancelBookingAPI = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API cancellation unavailable, using local context state:', error.message);
    return null;
  }
};
