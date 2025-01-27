import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "app/locales/en/translation.json";
import plTranslations from "app/locales/pl/translation.json";

// eslint-disable-next-line import/no-named-as-default-member
i18next.use(initReactI18next).init({
  fallbackLng: "en",
  lng: import.meta.env.VITE_E2E === "true" ? "en" : "pl",
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: enTranslations,
    },
    pl: {
      translation: plTranslations,
    },
  },
});

export default i18next;
