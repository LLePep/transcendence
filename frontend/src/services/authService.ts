import {
  apiClient,
  setStoredToken,
  removeStoredToken,
  getStoredToken,
} from './apiClient';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../types/auth';

export const authService = {
  /**
   * Register a new player account with username, email, and password.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: false,
    });
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  /**
   * Log into an existing player account using email or username + password.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: false,
    });
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  /**
   * Clear JWT session from local storage.
   */
  logout(): void {
    removeStoredToken();
  },

  /**
   * Get the current JWT token from storage.
   */
  getToken(): string | null {
    return getStoredToken();
  },
};
