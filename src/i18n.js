import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationDA from './locales/da/translation.json';
console.log(translationEN);
console.log(translationDA);

// the translations

// import translationEN from './locales/en/translation.json';
// import translationDA from './locales/da/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  da: {
    translation: translationDA
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use 'en' if detected language is not available
    interpolation: {
      escapeValue: false // React already protects from xss
    }
  });

export default i18n;