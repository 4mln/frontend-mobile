// app/_app.tsx
import React from "react";
import { Stack } from "expo-router";

// i18next setup
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: {} }, // add your translations
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default function App() {
  return <Stack />;
}
