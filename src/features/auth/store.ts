import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { User } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check auth status
  error: null,

  login: async (user, token, refreshToken) => {
    await SecureStore.setItemAsync('auth_token', token);
    if (refreshToken) {
      await SecureStore.setItemAsync('refresh_token', refreshToken);
    }
    set({ user, token, refreshToken, isAuthenticated: true, isLoading: false, error: null });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: null });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (token) {
        // In a real app, you'd verify the token or try to refresh it here
        // For now, we'll assume it's valid if present
        set({ token, refreshToken, isAuthenticated: true, isLoading: false });
        // Optionally fetch user profile here
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to initialize auth:', e);
      set({ isAuthenticated: false, isLoading: false, error: 'Failed to load session' });
    }
  },
}));

// Call initializeAuth when the app starts
useAuthStore.getState().initializeAuth();
