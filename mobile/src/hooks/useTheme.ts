import { useThemeStore } from '../store/themeStore';
import { AppTheme } from '../themes/types';

export function useTheme(): AppTheme {
  return useThemeStore((s) => s.activeTheme);
}

export function useThemeColors() {
  return useThemeStore((s) => s.activeTheme.colors);
}

export function useThemeMessages() {
  return useThemeStore((s) => s.activeTheme.messages);
}

export function useCompanion() {
  return useThemeStore((s) => s.activeTheme.companion);
}
