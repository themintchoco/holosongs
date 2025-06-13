import { Mutex, tryAcquire } from 'async-mutex'

import { api } from './api'

export const WHITELIST_UPDATE_INTERVAL = 60 * 24 * 7 // 1 week

const mutex = new Mutex()

export const updateWhitelist = async () => {
  try {
    await tryAcquire(mutex).runExclusive(async () => {
      const { whitelistUpdating } = await chrome.storage.local.get('whitelistUpdating')
      if (whitelistUpdating) throw new Error('Whitelist is already updating')

      await chrome.storage.local.set({ whitelistUpdating: true })
    })
  } catch {
    return false
  }

  const whitelist: Record<string, boolean> = {}

  let offset = 0
  const limit = 100

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const channels = await (await api(`channels?type=vtuber&limit=${limit}&offset=${offset}`)).json() as { id: string }[]

      if (!channels.length) break

      for (const { id } of channels) {
        whitelist[id] = true
      }

      offset += channels.length
    } catch {
      await chrome.storage.local.set({ whitelistUpdating: false })
      return false
    }
  }

  await chrome.storage.local.set({ whitelist, whitelistLastUpdated: (new Date()).getTime(), whitelistUpdating: false })
  return true
}
