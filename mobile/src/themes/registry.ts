import { AppTheme, AppThemeDefinition } from './types';
import { ShippedLocale, DEFAULT_LANGUAGE_ID } from '../i18n/languages';
import { vanillaTheme } from './vanilla';
import { darkFantasyTheme } from './dark-fantasy';
import { cyberpunkTheme } from './cyberpunk';
import { animeTheme } from './anime';
import { bodybuildingTheme } from './bodybuilding';
import { footballTheme } from './football';

export const THEME_REGISTRY: Record<string, AppThemeDefinition> = {
  'vanilla': vanillaTheme,
  'dark-fantasy': darkFantasyTheme,
  'cyberpunk': cyberpunkTheme,
  'anime': animeTheme,
  'bodybuilding': bodybuildingTheme,
  'football': footballTheme,
};

export const DEFAULT_THEME_ID = 'vanilla';

export function getTheme(id: string, locale: ShippedLocale = DEFAULT_LANGUAGE_ID): AppTheme {
  const def = THEME_REGISTRY[id] ?? THEME_REGISTRY[DEFAULT_THEME_ID];
  return {
    ...def,
    description: def.description[locale] ?? def.description.en,
    messages: def.messages[locale] ?? def.messages.en,
    companion: {
      ...def.companion,
      title: def.companion.title[locale] ?? def.companion.title.en,
      description: def.companion.description[locale] ?? def.companion.description.en,
    },
  };
}

export function getAllThemesResolved(locale: ShippedLocale = DEFAULT_LANGUAGE_ID): AppTheme[] {
  return Object.values(THEME_REGISTRY).map((def) => getTheme(def.id, locale));
}
