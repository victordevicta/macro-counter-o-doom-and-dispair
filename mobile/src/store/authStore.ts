import { create } from 'zustand';
import { User, UserProfile, NutritionGoal } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { usersApi } from '../api/users.api';
import { getAccessToken, clearTokens } from '../api/client';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  goals: NutritionGoal | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshGoals: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  setGoals: (goals: NutritionGoal) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  goals: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ isInitialized: true, isAuthenticated: false });
        return;
      }

      const me = await usersApi.getMe();
      const goals = await usersApi.getGoals().catch(() => null);

      set({
        user: me,
        profile: me.profile,
        goals,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch {
      await clearTokens();
      set({ isInitialized: true, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await authApi.login({ email, password });
      const me = await usersApi.getMe();
      const goals = await usersApi.getGoals().catch(() => null);

      set({
        user: me,
        profile: me.profile,
        goals,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      await authApi.register({ username, email, password });
      const me = await usersApi.getMe();
      const goals = await usersApi.getGoals().catch(() => null);

      set({
        user: me,
        profile: me.profile,
        goals,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, profile: null, goals: null, isAuthenticated: false });
    }
  },

  refreshProfile: async () => {
    const me = await usersApi.getMe();
    set({ user: me, profile: me.profile });
  },

  refreshGoals: async () => {
    const goals = await usersApi.getGoals();
    set({ goals });
  },

  setProfile: (profile) => set({ profile }),
  setGoals: (goals) => set({ goals }),
}));
