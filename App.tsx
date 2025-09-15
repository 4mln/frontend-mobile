import { create } from "zustand";
import { saveItem, getItem, deleteItem } from "@/utils/secureStore";
import { User } from "./types";
import axios from "axios"; // make sure axios is installed

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
  isLoading: true,
  error: null,

  login: async (user, token, refreshToken) => {
    try {
      await saveItem("auth_token", token);
      if (refreshToken) await saveItem("refresh_token", refreshToken);
      set({ user, token, refreshToken, isAuthenticated: true, isLoading: false, error: null });
    } catch (e) {
      console.error("Login failed:", e);
      set({ error: "Failed to save session", isLoading: false });
    }
  },

  logout: async () => {
    try {
      await deleteItem("auth_token");
      await deleteItem("refresh_token");
    } catch (e) {
      console.error("Logout cleanup failed:", e);
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: null });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await getItem("auth_token");
      const refreshToken = await getItem("refresh_token");

      if (token) {
        set({ token, refreshToken, isAuthenticated: true });

        // Fetch user profile from backend
        try {
          const response = await axios.get("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: response.data, isLoading: false });
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          set({ user: null, isLoading: false, error: "Failed to load user profile" });
        }

      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error("Failed to initialize auth:", e);
      set({ isAuthenticated: false, isLoading: false, error: "Failed to load session" });
    }
  },
}));
