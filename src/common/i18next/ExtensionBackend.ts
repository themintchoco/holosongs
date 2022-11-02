/* eslint-disable */

import type { BackendModule } from 'i18next'

const ExtensionBackend : () => BackendModule = () => {
  return {
    type: 'backend',
    init() { return },
    read(language, namespace, callback) {
      import(`../locales/${language}/${namespace}.json`)
        .then((resources) => callback(null, resources))
        .catch((error) => callback(error, null))
    },
  }
}

export default ExtensionBackend
