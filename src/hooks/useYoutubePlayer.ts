import { useEffect, useState } from 'react'

import { ensureSelector } from '../common/utils/dom-watch'

const useYoutubePlayer = (player?: HTMLElement) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)

  const [paused, setPaused] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playingAd, setPlayingAd] = useState(false)

  const handlePlay = () => {
    setPaused(false)
  }

  const handlePause = () => {
    setPaused(true)
  }

  const handleTimeUpdate = (e: Event) => {
    setCurrentTime((e.target as HTMLVideoElement).currentTime ?? 0)
  }

  const handleDurationChange = () => {
    setPlayingAd(false)
    ensureSelector('.ytp-ad-player-overlay-layout', { parent: player, timeout: 5 })
      .then(() => setPlayingAd(true))
      .catch(() => null)
  }

  useEffect(() => {
    const newVideo = player?.querySelector('video') ?? null
    if (newVideo) {
      newVideo.addEventListener('play', handlePlay)
      newVideo.addEventListener('pause', handlePause)
      newVideo.addEventListener('timeupdate', handleTimeUpdate)
      newVideo.addEventListener('durationchange', handleDurationChange)

      setPaused(newVideo.paused)
      setCurrentTime(0)
      handleDurationChange()
    }

    setVideo(newVideo)

    return () => {
      video?.removeEventListener('play', handlePlay)
      video?.removeEventListener('pause', handlePause)
      video?.removeEventListener('timeupdate', handleTimeUpdate)
      video?.removeEventListener('durationchange', handleDurationChange)
    }
  }, [player])

  return { video, paused, currentTime, playingAd }
}

export default useYoutubePlayer
