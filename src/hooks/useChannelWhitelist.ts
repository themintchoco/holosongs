import useStorage from './useStorage'

const useChannelWhitelist = () => {
  const [apiKey] = useStorage<string>('apiKey')
  const [whitelist, setWhitelist] = useStorage<Record<string, boolean>>('whitelist', {})
  const [whitelistLastUpdated, setWhitelistLastUpdated] = useStorage<number>('whitelistLastUpdated')

  const isWhitelisted = (channelId: string) => {
    return channelId in whitelist
  }

  const updateWhitelist = async () => {
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
    setWhitelistLastUpdated((new Date()).getTime())
  }

  const lastUpdated = whitelistLastUpdated && new Date(whitelistLastUpdated)

  return { whitelist, isWhitelisted, updateWhitelist, lastUpdated }
}

export default useChannelWhitelist
