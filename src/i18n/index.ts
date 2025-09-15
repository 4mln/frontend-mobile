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

const deviceLocale = (Localization as any)?.locale
  || (Array.isArray((Localization as any)?.locales) ? (Localization as any).locales[0] : 'en');
const localeTag = typeof deviceLocale === 'string' ? deviceLocale : (deviceLocale?.languageTag || 'en');
const initialLng = String(localeTag).toLowerCase().startsWith('fa') ? 'fa' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
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
