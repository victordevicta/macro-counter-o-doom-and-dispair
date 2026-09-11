import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme } from '../themes/types';
import { getTheme, DEFAULT_THEME_ID } from '../themes/registry';
import { ShippedLocale, DEFAULT_LANGUAGE_ID } from '../i18n/languages';
import { useLanguageStore } from './languageStore';

const currentLocale = (): ShippedLocale =>
  useLanguageStore.getState().languageId ?? DEFAULT_LANGUAGE_ID;

const THEME_STORAGE_KEY = '@doom_theme_id';

interface ThemeState {
  activeTheme: AppTheme;
  themeId: string;
  isLoaded: boolean;
  setTheme: (themeId: string) => Promise<void>;
  loadTheme: () => Promise<void>;
  resolveForLocale: (locale: ShippedLocale) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  activeTheme: getTheme(DEFAULT_THEME_ID, DEFAULT_LANGUAGE_ID),
  themeId: DEFAULT_THEME_ID,
  isLoaded: false,

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const id = saved ?? DEFAULT_THEME_ID;
      const theme = getTheme(id, currentLocale());
      set({ activeTheme: theme, themeId: id, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  setTheme: async (themeId: string) => {
    const theme = getTheme(themeId, currentLocale());
    set({ activeTheme: theme, themeId });
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // fail silently
    }
  },

  resolveForLocale: (locale: ShippedLocale) => {
    const { themeId } = get();
    set({ activeTheme: getTheme(themeId, locale) });
  },
}));
