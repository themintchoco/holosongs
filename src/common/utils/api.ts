import { KeyValidationResult, KeyValidationResultType } from '../types/KeyValidationResult'

const API_HOSTNAME = 'https://holodex.net/api/v2/'
const API_PROXY_HOSTNAME = 'https://holosongs.mintchoco.workers.dev/api/v2/'

export const api = async (url: string | URL, init?: RequestInit) => {
  const { useApiKey } = await chrome.storage.local.get('useApiKey')

  if (useApiKey) {
    const { apiKey } = await chrome.storage.local.get('apiKey')

    if (!apiKey) {
      throw new Error('API key is not set')
    }

    init = {
      ...init,
      headers: {
        ...init?.headers,
        'X-APIKEY': apiKey as string,
      }
    }
  }

  return fetch(new URL(url, useApiKey ? API_HOSTNAME : API_PROXY_HOSTNAME), init)
}

export const validateKey = async (apiKey: string) : Promise<KeyValidationResult> => {
  return fetch(new URL('videos', API_HOSTNAME), {
    headers: {
      'X-APIKEY': apiKey
    }
  }).then((r) => {
    if (r.status >= 500) return { type: KeyValidationResultType.error }
    if (r.status >= 400) return { type: KeyValidationResultType.invalid }
    return { type: KeyValidationResultType.valid }
  }).catch((e: Error) => {
    return { type: KeyValidationResultType.error, message: e.message }
  })
}
