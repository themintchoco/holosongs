export const WHITELIST_UPDATE_INTERVAL = 60 * 24 * 7 // 1 week

export const updateWhitelist = async () => {
  const { apiKey, whitelistUpdating } = await chrome.storage.local.get(['apiKey', 'whitelistUpdating'])
  if (!apiKey || whitelistUpdating) return false

  await chrome.storage.local.set({ whitelistUpdating: true })

  const whitelist: Record<string, boolean> = {}

  let offset = 0
  const limit = 100

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const channels = await (await fetch(`https://holodex.net/api/v2/channels?type=vtuber&limit=${limit}&offset=${offset}`, {
        headers: {
          'X-APIKEY': apiKey as string
        }
      })).json() as { id: string }[]

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
