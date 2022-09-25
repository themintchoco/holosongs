import useStorage from './useStorage'

const useChannelWhitelist = () => {
  const [apiKey] = useStorage<string>('apiKey')
  const [whitelist, setWhitelist] = useStorage<Record<string, boolean>>('whitelist', {})

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
  }

  return { isWhitelisted, updateWhitelist }
}

export default useChannelWhitelist
