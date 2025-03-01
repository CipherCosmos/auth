import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginResponse } from '../types/auth';
import { API_BASE_URL, ENDPOINTS, defaultFetchOptions, withAuth } from '../config/api';

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<number>;
  updatePassword: (email: string, otp: number, newPassword: string) => Promise<void>;
  clearError: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  requestPasswordReset: async () => 0,
  updatePassword: async () => {},
  clearError: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        ...defaultFetchOptions,
        body: JSON.stringify({ email, password }),
      });
      
      const data: LoginResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      const user: User = {
        username: data.username,
        email: data.email,
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: data.token },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  };

  // Register function
  const register = async (email: string, password: string, username: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        ...defaultFetchOptions,
        body: JSON.stringify({ email, password, username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // After successful registration, automatically log in
      await login(email, password);
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.token) {
        await fetch(`${API_BASE_URL}${ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          ...withAuth(state.token),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (name: string) => {
    if (!state.token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_PROFILE}`, {
        method: 'PUT',
        ...withAuth(state.token),
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      // Update user in state and localStorage
      if (state.user) {
        const updatedUser = {
          ...state.user,
          username: name,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        dispatch({
          type: 'UPDATE_USER',
          payload: updatedUser,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  // Request password reset (OTP) function
  const requestPasswordReset = async (email: string): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.RESET_PASSWORD}`, {
        method: 'POST',
        ...defaultFetchOptions,
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset request failed');
      }
      
      return data.message as number; // OTP is returned as a numeric value
    } catch (error) {
      throw error;
    }
  };

  // Update password using OTP function
  const updatePassword = async (email: string, otp: number, new_password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_PASSWORD}`, {
        method: 'POST',
        ...defaultFetchOptions,
        body: JSON.stringify({ email, otp, new_password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password update failed');
      }
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateProfile,
        requestPasswordReset,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);