import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { detectDeviceLanguageId, DEFAULT_LANGUAGE_ID, ShippedLocale } from '../i18n/languages';
import { useThemeStore } from './themeStore';

const LANGUAGE_STORAGE_KEY = '@doom_language_id';

interface LanguageState {
  languageId: ShippedLocale;
  isLoaded: boolean;
  setLanguage: (id: ShippedLocale) => Promise<void>;
  loadLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  languageId: DEFAULT_LANGUAGE_ID,
  isLoaded: false,

  loadLanguage: async () => {
    try {
      const saved = (await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)) as ShippedLocale | null;
      const id = saved ?? detectDeviceLanguageId();
      await i18n.changeLanguage(id);
      set({ languageId: id, isLoaded: true });
      useThemeStore.getState().resolveForLocale(id);
    } catch {
      set({ isLoaded: true });
    }
  },

  setLanguage: async (id: ShippedLocale) => {
    await i18n.changeLanguage(id);
    set({ languageId: id });
    useThemeStore.getState().resolveForLocale(id);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, id);
    } catch {
      // fail silently
    }
  },
}));
