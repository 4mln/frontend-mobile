import { apiClient } from '@/services/api';
import { AuthResponse, LoginRequest, VerifyOTPRequest } from './types';

export const authApi = {
  // Send OTP to phone number
  sendOTP: async (data: LoginRequest): Promise<{ detail: string }> => {
    const response = await apiClient.post('/otp/request', data);
    return response.data;
  },

  // Verify OTP and get tokens
  verifyOTP: async (data: VerifyOTPRequest): Promise<{ access_token: string; token_type: string }> => {
    const response = await apiClient.post('/otp/verify', { phone: data.phone, code: data.otp });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get('/me/profile');
    return response.data;
  },

  // Get current user (basic info)
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> => {
    const response = await apiClient.patch('/me/profile', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/me/sessions/logout-all');
  },
};
