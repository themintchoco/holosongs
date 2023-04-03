import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import useStorage from '../../hooks/useStorage'
import useYoutubePlayer from '../../hooks/useYoutubePlayer'
import useChannelWhitelist from '../../hooks/useChannelWhitelist'
import SongsPanel from './SongsPanel'
import DexLink from './DexLink'

export enum RepeatMode {
  Off,
  On,
  One,
}

export enum MusicMode {
  Off,
  On,
}

export interface Song {
  id: string,
  name: string,
  original_artist: string,
  start: number,
  end: number,
  itunesid?: string,
  art?: string,
}

export interface ContentProps {
  player?: HTMLElement,
  videoId?: string,
  channelId?: string,
  songsPanelContainer: HTMLElement,
  dexLinkContainer: HTMLElement,
}

const Content = ({ player, videoId, channelId, songsPanelContainer, dexLinkContainer } : ContentProps) => {
  const [apiKey] = useStorage<string>('apiKey')
  const [showDexButton] = useStorage('showDexButton', true)
  const [enableWhitelist] = useStorage('enableWhitelist', false)

  const { isWhitelisted } = useChannelWhitelist()
  const { video, paused, currentTime, playingAd } = useYoutubePlayer(player)

  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off)
  const [musicMode, setMusicMode] = useState(MusicMode.Off)
  const [songsPanelCollapsed, setSongsPanelCollapsed] = useState(false)

  useEffect(() => {
    if (!videoId || !channelId || apiKey === undefined || enableWhitelist === undefined || isWhitelisted(channelId) === undefined) return
    if (!apiKey || enableWhitelist && !isWhitelisted(channelId)) return setSongs([])

    fetch(`https://holodex.net/api/v2/videos?id=${videoId}&include=songs`, {
      headers: {
        'X-APIKEY': apiKey,
      }
    }).then((r) => r.json())
      .then((data: { songs: Song[] }[]) => {
        if (data.length <= 0 || !data[0].songs) throw new Error()
        setSongs(data[0].songs.sort((a, b) => { return a.start - b.start }))
      })
      .catch(() => {
        setSongs([])
      })
  }, [videoId, channelId, apiKey, enableWhitelist, isWhitelisted])

  useEffect(() => {
    setCurrentSong(null)
  }, [songs])

  useEffect(() => {
    if (!video || songs.length === 0 || playingAd) return

    if (currentSong && currentTime >= Math.min(video.duration, currentSong.end) && repeatMode !== RepeatMode.Off) {
      switch (repeatMode) {
      case RepeatMode.On:
        if (!getNextSong()) video.currentTime = songs[0].start
        break
      case RepeatMode.One:
        video.currentTime = currentSong.start
        break
      }
    }

    if (!currentSong || currentTime < currentSong.start || currentTime > currentSong.end) {
      let nextSong: Song | null = null

      for (const song of songs) {
        if (song.start <= currentTime && currentTime <= song.end) {
          nextSong = song
          break
        }
      }

      if (!nextSong && musicMode !== MusicMode.Off) {
        nextSong = getNextSong()
        video.currentTime = nextSong?.start ?? video.duration
      }

      setCurrentSong(nextSong)
    }
  }, [currentTime])

  const getNextSong = () => {
    for (const song of songs) {
      if (currentTime < song.start) return song
    }

    return null
  }

  const getPrevSong = () => {
    for (const song of songs.slice().reverse()) {
      if (currentTime > song.end) return song
    }

    return null
  }

  const handleSelectSong = (song: Song) => {
    setCurrentSong(null)
    if (video) video.currentTime = song.start

    const url = new URL(window.location.href)
    url.searchParams.set('t', song.start.toString())
    window.history.replaceState(window.history.state, '', url.toString())
  }

  const handleSkipForward = () => {
    if (video) video.currentTime = getNextSong()?.start ?? video?.duration
  }

  const handleSkipBackward = () => {
    if (video) video.currentTime = (!currentSong || currentTime - currentSong.start < 5) ? getPrevSong()?.start ?? 0 : currentSong?.start
  }

  const handleSeek = (t: number) => {
    if (video && currentSong) video.currentTime = currentSong.start + t
  }

  const handleToggleRepeatMode = () => {
    setRepeatMode((repeatMode) => {
      switch (repeatMode) {
      case RepeatMode.Off:
        return RepeatMode.On
      case RepeatMode.On:
        return RepeatMode.One
      case RepeatMode.One:
        return RepeatMode.Off
      }
    })
  }

  const handleToggleMusicMode = () => {
    setMusicMode((musicMode) => {
      switch (musicMode) {
      case MusicMode.Off:
        return MusicMode.On
      case MusicMode.On:
        return MusicMode.Off
      }
    })
  }

  const handleToggleSongsPanelCollapsed = () => {
    setSongsPanelCollapsed((collapsed) => !collapsed)
  }

  const handleClickDexLink = () => {
    if (!videoId) return

    const url = new URL(`https://holodex.net/watch/${videoId}`)
    url.searchParams.set('t', Math.floor(currentTime).toString())
    window.location.href = url.toString()
  }

  return (
    <>
      {
        songs.length && createPortal((
          <SongsPanel
            songs={songs}
            currentSong={!playingAd ? currentSong : null}
            currentSongProgress={(currentSong && !playingAd) ? currentTime - currentSong.start : null}
            playing={!paused}
            repeatMode={repeatMode}
            musicMode={musicMode}
            collapsed={songsPanelCollapsed}
            onSelectSong={handleSelectSong}
            onPlay={() => video?.play()}
            onPause={() => video?.pause()}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            onSeek={handleSeek}
            onToggleRepeatMode={handleToggleRepeatMode}
            onToggleMusicMode={handleToggleMusicMode}
            onToggleCollapsed={handleToggleSongsPanelCollapsed}
          />
        ), songsPanelContainer)
      }

      {
        songs.length && showDexButton && createPortal((
          <DexLink onClick={handleClickDexLink} />
        ), dexLinkContainer)
      }
    </>
  )
}

export default Content
