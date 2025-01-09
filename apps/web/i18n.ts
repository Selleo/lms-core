import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../web/app/locales/en/translation.json";
import plTranslations from "../web/app/locales/pl/translation.json";

i18next.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "pl",
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
