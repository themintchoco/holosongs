import { useState } from 'react'

import useStorage from './useStorage'

const useChannelWhitelist = () => {
  const [apiKey] = useStorage<string>('apiKey')
  const [whitelist, setWhitelist] = useStorage<Record<string, boolean>>('whitelist', {})
  const [lastUpdated, setLastUpdated] = useStorage<number>('whitelistLastUpdated')
  const [isWhitelistUpdating, setIsWhitelistUpdating] = useState(false)

  const isWhitelisted = (channelId: string) => {
    return channelId in whitelist
  }

  const updateWhitelist = async () => {
    setIsWhitelistUpdating(true)
    const newWhitelist = {}

    let offset = 0
    const limit = 100

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const channels = await (await fetch(`https://holodex.net/api/v2/channels?type=vtuber&limit=${limit}&offset=${offset}`, {
        headers: {
          'X-APIKEY': apiKey
        }
      })).json()
      if (!channels.length) break

      for (const { id } of channels) newWhitelist[id] = true
      offset += channels.length
    }

    setWhitelist(newWhitelist)
    setLastUpdated((new Date()).getTime())
    setIsWhitelistUpdating(false)
  }

  const whitelistLastUpdated = lastUpdated && new Date(lastUpdated)

  return { whitelist, isWhitelisted, updateWhitelist, whitelistLastUpdated, isWhitelistUpdating }
}

export default useChannelWhitelist
