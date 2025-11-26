// API service for the flight booking system
// This connects to the actual backend API

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to make HTTP requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

// Auth API
export const auth = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store tokens in localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  },
  
  register: async (firstName, lastName, email, password) => {
    return await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password })
    });
  },
  
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });
    }
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return { success: true };
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    
    // Update tokens in localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  }
};

// Airport API
export const airports = {
  getAllCountries: async () => {
    return await apiRequest('/airports/countries');
  },
  
  getStatesByCountry: async (countryId) => {
    return await apiRequest(`/airports/countries/${countryId}/states`);
  },
  
  getAirportsByCountry: async (countryId) => {
    return await apiRequest(`/airports/countries/${countryId}/airports`);
  },
  
  getAirportsByState: async (stateId) => {
    return await apiRequest(`/airports/states/${stateId}/airports`);
  },
  
  searchAirportsByName: async (name) => {
    return await apiRequest(`/airports/search/name?name=${encodeURIComponent(name)}`);
  },
  
  searchAirportsByCity: async (city) => {
    return await apiRequest(`/airports/search/city?city=${encodeURIComponent(city)}`);
  },
  
  searchAirportsByIataCode: async (iataCode) => {
    return await apiRequest(`/airports/search/iata?iataCode=${encodeURIComponent(iataCode)}`);
  },
  
  getAirportByIataCode: async (iataCode) => {
    return await apiRequest(`/airports/iata/${iataCode}`);
  }
};

// Flight API
export const flights = {
  search: async (originAirportId, destinationAirportId, travelDate, passengers, sortBy = 'best') => {
    const params = new URLSearchParams({
      originAirportId,
      destinationAirportId,
      travelDate,
      passengers,
      sortBy
    });
    
    return await apiRequest(`/flights/search?${params}`);
  },
  
  getById: async (flightId) => {
    return await apiRequest(`/flights/${flightId}`);
  },
  
  getFlightsByAirline: async (airline) => {
    return await apiRequest(`/flights/airline?airline=${encodeURIComponent(airline)}`);
  },
  
  getFlightsByStatus: async (status) => {
    return await apiRequest(`/flights/status?status=${encodeURIComponent(status)}`);
  },
  
  lockSeat: async (flightId, seatNumber) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      flightId,
      seatNumber
    });
    
    return await apiRequest(`/flights/seat-lock?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  unlockSeat: async (flightId, seatNumber) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      flightId,
      seatNumber
    });
    
    return await apiRequest(`/flights/seat-lock?${params}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
};

// Booking API
export const bookings = {
  create: async (userId, flightId, passengers, seatNumbers, totalPrice) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      userId,
      flightId,
      seatNumbers: seatNumbers.join(','),
      totalPrice
    });
    
    return await apiRequest(`/bookings?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passengers)
    });
  },
  
  confirmBooking: async (bookingId, paymentId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      paymentId
    });
    
    return await apiRequest(`/bookings/${bookingId}/confirm?${params}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  cancelBooking: async (bookingId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    return await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  getBookingByPNR: async (pnr) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    return await apiRequest(`/bookings/pnr/${pnr}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  getBookingsByUser: async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    return await apiRequest(`/bookings/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
};

// Payment API
export const payments = {
  create: async (bookingId, userId, amount, currency, paymentMethod, transactionId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      bookingId,
      userId,
      amount,
      currency,
      paymentMethod,
      transactionId
    });
    
    return await apiRequest(`/payments?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  initiate: async (bookingId, userId, amount, currency, paymentMethod, description, metadata = {}) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      bookingId,
      userId,
      amount,
      currency,
      paymentMethod,
      description
    });
    
    return await apiRequest(`/payments/initiate?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });
  },
  
  confirmPayment: async (paymentId, transactionId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      transactionId
    });
    
    return await apiRequest(`/payments/${paymentId}/confirm?${params}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  failPayment: async (paymentId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    return await apiRequest(`/payments/${paymentId}/fail`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  refundPayment: async (paymentId, amount) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    const params = new URLSearchParams({
      amount
    });
    
    return await apiRequest(`/payments/${paymentId}/refund?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },
  
  getPaymentsByUser: async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('User not authenticated');
    }
    
    return await apiRequest(`/payments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
};

export default {
  auth,
  airports,
  flights,
  bookings,
  payments
};