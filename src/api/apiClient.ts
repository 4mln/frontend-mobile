import { API_CONFIG } from '@/config/api';
import { useAuthStore } from '@/features/auth/store';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          await SecureStore.setItemAsync('auth_token', token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        const { logout } = useAuthStore.getState();
        logout();
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
      }
    }

    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Auth methods - Updated to match backend endpoints
  auth: {
    sendOTP: (phone: string) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP, { phone }),
    verifyOTP: (phone: string, otp: string) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, { phone, code: otp }),
    refreshToken: (refreshToken: string) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),
    getProfile: () => apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE),
    updateProfile: (data: any) => apiClient.patch(API_CONFIG.ENDPOINTS.AUTH.PROFILE, data),
    logout: () => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
    getCurrentUser: () => apiClient.get(API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER),
  },

  // Products
  products: {
    list: (params?: any) => apiClient.get('/products', { params }),
    get: (id: string) => apiClient.get(`/products/${id}`),
    create: (data: any) => apiClient.post('/products', data),
    update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/products/${id}`),
    search: (query: string, filters?: any) => apiClient.get('/products/search', { 
      params: { q: query, ...filters } 
    }),
  },

  // Guilds/Categories
  guilds: {
    list: () => apiClient.get('/guilds'),
    get: (id: string) => apiClient.get(`/guilds/${id}`),
    getProducts: (id: string, params?: any) => apiClient.get(`/guilds/${id}/products`, { params }),
  },

  // RFQs
  rfqs: {
    list: (params?: any) => apiClient.get('/rfqs', { params }),
    get: (id: string) => apiClient.get(`/rfqs/${id}`),
    create: (data: any) => apiClient.post('/rfqs', data),
    update: (id: string, data: any) => apiClient.put(`/rfqs/${id}`, data),
    delete: (id: string) => apiClient.delete(`/rfqs/${id}`),
  },

  // Chat
  chat: {
    getConversations: () => apiClient.get('/chat/conversations'),
    getMessages: (conversationId: string) => apiClient.get(`/chat/conversations/${conversationId}/messages`),
    sendMessage: (conversationId: string, data: any) => apiClient.post(`/chat/conversations/${conversationId}/messages`, data),
    createConversation: (data: any) => apiClient.post('/chat/conversations', data),
  },

  // Wallet
  wallet: {
    getBalance: () => apiClient.get('/wallet/balance'),
    getTransactions: (params?: any) => apiClient.get('/wallet/transactions', { params }),
    topUp: (data: any) => apiClient.post('/wallet/top-up', data),
    withdraw: (data: any) => apiClient.post('/wallet/withdraw', data),
  },
};

export default apiClient;
