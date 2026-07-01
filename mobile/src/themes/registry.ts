import { AppTheme } from './types';
import { darkFantasyTheme } from './dark-fantasy';
import { cyberpunkTheme } from './cyberpunk';
import { animeTheme } from './anime';
import { bodybuildingTheme } from './bodybuilding';
import { cleanTheme } from './clean';
import { footballTheme } from './football';

export const THEME_REGISTRY: Record<string, AppTheme> = {
  'dark-fantasy': darkFantasyTheme,
  'cyberpunk': cyberpunkTheme,
  'anime': animeTheme,
  'bodybuilding': bodybuildingTheme,
  'clean': cleanTheme,
  'football': footballTheme,
};

export const ALL_THEMES: AppTheme[] = Object.values(THEME_REGISTRY);

export const DEFAULT_THEME_ID = 'dark-fantasy';

export function getTheme(id: string): AppTheme {
  return THEME_REGISTRY[id] ?? darkFantasyTheme;
}
