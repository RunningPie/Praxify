import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationID from './locales/id/translation.json';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    // Your translations
    resources: {
      en: {
        translation: translationEN
      },
      id: {
        translation: translationID
      }
    },
    // The language to use if translations in the user's language are not available
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    // Options for language detector
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'praxify-language', // Use your existing localStorage key
    }
  });

export default i18n; 