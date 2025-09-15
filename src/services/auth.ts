import apiClient from './api';

// Types
export interface LoginRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Auth service functions
export const authService = {
  /**
   * Send OTP to phone number
   */
  async sendOTP(data: LoginRequest): Promise<ApiResponse<{ detail: string }>> {
    try {
      const response = await apiClient.post('/otp/request', data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to send OTP',
        success: false,
      };
    }
  },

  /**
   * Verify OTP and get tokens
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/otp/verify', {
        phone: data.phone,
        code: data.otp,
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Invalid OTP',
        success: false,
      };
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const response = await apiClient.post('/auth/refresh', data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to refresh token',
        success: false,
      };
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<AuthResponse['user']>> {
    try {
      const response = await apiClient.get('/me/profile');
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch profile',
        success: false,
      };
    }
  },

  /**
   * Get current user (basic info)
   */
  async getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
    try {
      const response = await apiClient.get('/me');
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch user',
        success: false,
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<AuthResponse['user']>> {
    try {
      const response = await apiClient.patch('/me/profile', data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to update profile',
        success: false,
      };
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/me/sessions/logout-all');
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to logout',
        success: false,
      };
    }
  },
};

