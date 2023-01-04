import 'i18next'

import content from '../common/locales/en-US/content.json'
import options from '../common/locales/en-US/options.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      content: typeof content
      options: typeof options
    }
  }
}


