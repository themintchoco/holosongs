/* eslint-disable */

import type { LanguageDetectorAsyncModule, Services } from 'i18next'

const ExtensionLanguageDetect : () => LanguageDetectorAsyncModule & { services?: Services } = () => {
  return {
    type: 'languageDetector',
    async: true,
    init(services) {
      this.services = services
    },
    async detect(callback) {
      const { language } = await chrome.storage.local.get('language')
      if (language) return callback(language)
  
      callback(this.services?.languageUtils.getBestMatchFromCodes(await chrome.i18n.getAcceptLanguages()))
    },
    async cacheUserLanguage(language) {
      await chrome.storage.local.set({ language })
    },
  }
}

export default ExtensionLanguageDetect
