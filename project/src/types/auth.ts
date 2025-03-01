export interface User {
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  refresh: string;
  username: string;
  email: string;
}

export interface ApiResponse {
  message: string;
  token?: string;
  refresh?: string;
  username?: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}