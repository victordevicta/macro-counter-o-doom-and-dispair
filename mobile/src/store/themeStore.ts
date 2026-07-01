import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme } from '../themes/types';
import { getTheme, DEFAULT_THEME_ID } from '../themes/registry';

const THEME_STORAGE_KEY = '@doom_theme_id';

interface ThemeState {
  activeTheme: AppTheme;
  themeId: string;
  isLoaded: boolean;
  setTheme: (themeId: string) => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: getTheme(DEFAULT_THEME_ID),
  themeId: DEFAULT_THEME_ID,
  isLoaded: false,

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const id = saved ?? DEFAULT_THEME_ID;
      const theme = getTheme(id);
      set({ activeTheme: theme, themeId: id, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  setTheme: async (themeId: string) => {
    const theme = getTheme(themeId);
    set({ activeTheme: theme, themeId });
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // fail silently
    }
  },
}));
