import { useState } from 'react'

import useStorage from './useStorage'

const useChannelWhitelist = () => {
  const [apiKey] = useStorage<string>('apiKey')
  const [whitelist, setWhitelist] = useStorage<Record<string, boolean>>('whitelist', {})
  const [lastUpdated, setLastUpdated] = useStorage<number>('whitelistLastUpdated')
  const [isWhitelistUpdating, setIsWhitelistUpdating] = useState(false)

  const isWhitelisted = (channelId: string) => {
    return whitelist ? channelId in whitelist : false
  }

  const updateWhitelist = async () => {
    if (!apiKey) return false

    setIsWhitelistUpdating(true)
    const newWhitelist: Record<string, boolean> = {}

    let offset = 0
    const limit = 100

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const channels = await (await fetch(`https://holodex.net/api/v2/channels?type=vtuber&limit=${limit}&offset=${offset}`, {
        headers: {
          'X-APIKEY': apiKey
        }
      })).json() as { id: string }[]
      if (!channels.length) break

      for (const { id } of channels) newWhitelist[id] = true
      offset += channels.length
    }

    setWhitelist(newWhitelist)
    setLastUpdated((new Date()).getTime())
    setIsWhitelistUpdating(false)

    return true
  }

  const whitelistLastUpdated = lastUpdated && new Date(lastUpdated)

  return { whitelist, isWhitelisted, updateWhitelist, whitelistLastUpdated, isWhitelistUpdating }
}

export default useChannelWhitelist
