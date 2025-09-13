import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import fa from './locales/fa.json';

const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.startsWith('fa') ? 'fa' : 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    // RTL support
    react: {
      useSuspense: false,
    },
  });

export default i18n;
