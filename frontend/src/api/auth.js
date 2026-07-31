import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Sign up new user
  signup: async (userData) => {
    try {
      const response = await api.post('/api/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: 'error', message: 'Network error' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: 'error', message: 'Network error' };
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: 'error', message: 'Network error' };
    }
  },

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api;
