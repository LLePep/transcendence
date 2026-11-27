import type { LanguageOption } from '../types/i18n';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'fr',
    nativeName: 'Français',
    dir: 'ltr',
    flag: '🇫🇷',
  },
  // Architecture prête pour l'ajout ultérieur sans modifier les composants :
  // { code: 'en', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  // { code: 'ar', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
];

export const DEFAULT_LANGUAGE = 'fr';
export const STORAGE_LANG_KEY = 'transcendence_lng';
