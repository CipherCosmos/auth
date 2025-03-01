// API configuration
export const API_BASE_URL = 'http://127.0.0.1:5000';

// API endpoints
export const ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',
  UPDATE_PASSWORD: '/update-password',
  LOGOUT: '/logout',
  UPDATE_PROFILE: '/update-profile',
};

// Default fetch options
export const defaultFetchOptions = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to add authorization header
export const withAuth = (token: string, options = {}) => ({
  ...defaultFetchOptions,
  ...options,
  headers: {
    ...defaultFetchOptions.headers,
    Authorization: `Bearer ${token}`,
  },
});