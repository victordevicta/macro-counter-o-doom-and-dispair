import * as Localization from 'expo-localization';

export type ShippedLocale = 'en' | 'pt-BR';
export type SupportedLocale = ShippedLocale | 'es' | 'it' | 'fr';

export interface AppLanguage {
  id: SupportedLocale;
  englishName: string;
  nativeName: string;
  flagEmoji: string;
  locked: boolean;
}

export const LANGUAGE_REGISTRY: AppLanguage[] = [
  { id: 'en', englishName: 'English', nativeName: 'English', flagEmoji: '🇺🇸', locked: false },
  { id: 'pt-BR', englishName: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flagEmoji: '🇧🇷', locked: false },
  { id: 'es', englishName: 'Spanish', nativeName: 'Español', flagEmoji: '🇪🇸', locked: true },
  { id: 'it', englishName: 'Italian', nativeName: 'Italiano', flagEmoji: '🇮🇹', locked: true },
  { id: 'fr', englishName: 'French', nativeName: 'Français', flagEmoji: '🇫🇷', locked: true },
];

export const DEFAULT_LANGUAGE_ID: ShippedLocale = 'en';

const SHIPPED_LOCALES: ShippedLocale[] = ['en', 'pt-BR'];

export function isShippedLocale(id: string): id is ShippedLocale {
  return (SHIPPED_LOCALES as string[]).includes(id);
}

export function detectDeviceLanguageId(): ShippedLocale {
  try {
    const languageCode = Localization.getLocales()[0]?.languageCode;
    if (languageCode === 'pt') return 'pt-BR';
    return DEFAULT_LANGUAGE_ID;
  } catch {
    return DEFAULT_LANGUAGE_ID;
  }
}
