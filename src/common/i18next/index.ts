import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ExtensionLanguageDetect from './ExtensionLanguageDetect'
import ExtensionBackend from './ExtensionBackend'

void i18n
  .use(ExtensionLanguageDetect())
  .use(ExtensionBackend())
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
