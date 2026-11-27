import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from './locales/fr.json';
import {
  DEFAULT_LANGUAGE,
  STORAGE_LANG_KEY,
  SUPPORTED_LANGUAGES,
} from './constants/languages';
import type { TextDirection } from './types/i18n';

/**
 * Returns text direction (ltr or rtl) for a given language code.
 */
export function getLanguageDirection(langCode: string): TextDirection {
  const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === langCode);
  return language ? language.dir : 'ltr';
}

/**
 * Synchronizes document.documentElement attributes with the current language.
 */
export function applyDocumentLanguage(langCode: string): void {
  const dir = getLanguageDirection(langCode);
  document.documentElement.lang = langCode;
  document.documentElement.dir = dir;
}

// Retrieve previously saved language or fall back to default
const savedLanguage = (() => {
  try {
    return localStorage.getItem(STORAGE_LANG_KEY) || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
})();

// Check that the selected language is actually supported, fallback to default
const initialLanguage = SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)
  ? savedLanguage
  : DEFAULT_LANGUAGE;

// Apply attributes on document root immediately
applyDocumentLanguage(initialLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslation,
      },
    },
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
  });

// Listen to language changes to persist and update HTML attributes
i18n.on('languageChanged', (lng: string) => {
  applyDocumentLanguage(lng);
  try {
    localStorage.setItem(STORAGE_LANG_KEY, lng);
  } catch (error) {
    console.warn('Unable to persist language in localStorage:', error);
  }
});

export default i18n;
