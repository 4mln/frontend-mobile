import '@/polyfills/web';
import { deleteItem, getItem, saveItem } from "@/utils/secureStore";
import { User } from "./types";
// Ensure process.env before requiring zustand (SSR/web)
// @ts-expect-error
if (typeof globalThis.process === 'undefined') {
  // @ts-expect-error
  globalThis.process = { env: {} };
} else if (typeof (globalThis as any).process.env === 'undefined') {
  (globalThis as any).process.env = {};
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { create } = require('zustand');

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  approved: boolean;
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
  approved: false,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (user, token, refreshToken) => {
    try {
      await saveItem("auth_token", token);
      if (refreshToken) {
        await saveItem("refresh_token", refreshToken);
      }
      // Mark that user explicitly approved login (e.g., after OTP)
      await saveItem("login_approved", "true");
      set({
        user,
        token,
        refreshToken,
        approved: true,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      console.error("Login failed:", e);
      set({ error: "Failed to save session", isLoading: false });
    }
  },

  logout: async () => {
    try {
      await deleteItem("auth_token");
      await deleteItem("refresh_token");
      await deleteItem("login_approved");
    } catch (e) {
      console.error("Logout cleanup failed:", e);
    } finally {
      set({
        user: null,
        token: null,
        refreshToken: null,
        approved: false,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const forceReset = (process.env.EXPO_PUBLIC_RESET_LOGIN_ON_START === 'true' || process.env.EXPO_PUBLIC_RESET_LOGIN_ON_START === '1');
      if (forceReset) {
        try {
          await deleteItem('auth_token');
          await deleteItem('refresh_token');
          await deleteItem('login_approved');
        } catch {}
        set({ user: null, token: null, refreshToken: null, approved: false, isAuthenticated: false, isLoading: false, error: null });
        return;
      }

      const token = await getItem("auth_token");
      const refreshToken = await getItem("refresh_token");
      const approved = await getItem("login_approved");
      const requireOtpOnStart = (process.env.EXPO_PUBLIC_REQUIRE_OTP_ON_START === 'true' || process.env.EXPO_PUBLIC_REQUIRE_OTP_ON_START === '1');

      // Only restore session if user had explicitly approved login previously
      if (token && approved === 'true' && !requireOtpOnStart) {
        // Proactively fetch user profile using shared API service
        // Dynamic import to avoid circular deps at module load
        try {
          const { authService } = await import('@/services/auth');
          const profileResp = await authService.getProfile();
          if (profileResp.success && profileResp.data) {
            set({
              user: profileResp.data,
              token,
              refreshToken,
              approved: true,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // If unauthorized, clear session; otherwise keep session and allow lazy fetch later
            const unauthorized = (profileResp.error || '').toLowerCase().includes('unauthorized') || (profileResp as any).status === 401;
            if (unauthorized) {
              await deleteItem('auth_token');
              await deleteItem('refresh_token');
              set({ user: null, token: null, refreshToken: null, approved: false, isAuthenticated: false, isLoading: false, error: null });
            } else {
              set({ user: null, token, refreshToken, approved: true, isAuthenticated: true, isLoading: false, error: null });
            }
          }
        } catch (err) {
          // Network or other error: keep auth state, user will be fetched later
          set({ user: null, token, refreshToken, approved: true, isAuthenticated: true, isLoading: false, error: null });
        }
      } else {
        try { await deleteItem('login_approved'); } catch {}
        set({
          user: null,
          token: null,
          refreshToken: null,
          approved: false,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (e) {
      console.error("Failed to initialize auth:", e);
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to load session",
      });
    }
  },
}));

// You can now call initializeAuth in your App entry file instead of here
