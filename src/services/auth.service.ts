/**
 * Authentication Service
 * Handles login, register, logout, and user profile operations
 */

import api from './api';
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  MessageResponse,
} from './types';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    api.setToken(response.token);
    return response;
  },

  /**
   * Register a new user (venue owner)
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    api.setToken(response.token);
    return response;
  },

  /**
   * Refresh the JWT token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    api.setToken(response.token);
    return response;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/logout');
    api.setToken(null);
    return response;
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  /**
   * Update current user profile
   */
  async updateMe(data: Partial<User>): Promise<User> {
    return api.put<User>('/auth/me', data);
  },

  /**
   * Delete current user account
   */
  async deleteMe(): Promise<MessageResponse> {
    return api.delete<MessageResponse>('/auth/me');
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    return api.post<MessageResponse>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, passwordConfirm: string): Promise<MessageResponse> {
    return api.post<MessageResponse>('/auth/reset-password', {
      token,
      password,
      password_confirm: passwordConfirm,
    });
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!api.getToken();
  },
};

export default authService;
