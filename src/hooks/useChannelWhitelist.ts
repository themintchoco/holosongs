import useStorage from './useStorage'
import { updateWhitelist } from '../common/utils/channel-whitelist'

const useChannelWhitelist = () => {
  const [whitelist] = useStorage<Record<string, boolean>>('whitelist', {})
  const [lastUpdated] = useStorage<number>('whitelistLastUpdated', 0)
  const [isWhitelistUpdating] = useStorage('whitelistUpdating', false)

  const isWhitelisted = (channelId: string) => {
    return whitelist ? channelId in whitelist : false
  }

  const whitelistLastUpdated = lastUpdated ? new Date(lastUpdated) : lastUpdated === undefined ? undefined : null

  return { whitelist, isWhitelisted, updateWhitelist, whitelistLastUpdated, isWhitelistUpdating }
}

export default useChannelWhitelist
