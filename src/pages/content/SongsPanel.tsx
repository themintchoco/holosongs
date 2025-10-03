import { useTranslation } from 'react-i18next'

import useStorage from '../../hooks/useStorage'
import { Song, RepeatMode, MusicMode } from './Content'
import YoutubePanel, { YoutubePanelHeader, YoutubePanelListContent, YoutubePanelFooter } from './YoutubePanel'
import SongItem from './SongItem'
import SongControls from './SongControls'
import SongProgressBar from './SongProgressBar'

export interface SongsPanelProps {
  songs: Song[],
  playedSongs: Set<Song>,
  currentSong: Song | null,
  currentSongProgress: number | null,
  playing: boolean,
  repeatMode: RepeatMode,
  musicMode: MusicMode,
  collapsed: boolean,
  onSelectSong?: (song: Song) => void,
  onPlay?: () => void,
  onPause?: () => void,
  onSkipForward?: () => void,
  onSkipBackward?: () => void,
  onSeek?: (t: number) => void,
  onToggleRepeatMode?: () => void,
  onToggleMusicMode?: () => void,
  onToggleCollapsed?: () => void,
}

const SongsPanel = ({
  songs,
  playedSongs,
  currentSong,
  currentSongProgress,
  playing,
  repeatMode,
  musicMode,
  collapsed,
  onSelectSong,
  onPlay,
  onPause,
  onSkipForward,
  onSkipBackward,
  onSeek,
  onToggleRepeatMode,
  onToggleMusicMode,
  onToggleCollapsed,
}: SongsPanelProps) => {
  const { t } = useTranslation('content')
  const [showSongControls] = useStorage('showSongControls', true)

  return (
    <YoutubePanel>
      <YoutubePanelHeader
        title={t('songsPanel.header.title')}
        isCollapsed={collapsed}
        onToggleCollapsed={onToggleCollapsed}
      />
      {
        !collapsed && (
          <>
            <YoutubePanelListContent>
              {
                songs.map((song) => (
                  <SongItem key={song.id} song={song} active={song.id === currentSong?.id} played={playedSongs.has(song)} onSelectSong={onSelectSong} />
                ))
              }
            </YoutubePanelListContent>
            {
              showSongControls && (
                <YoutubePanelFooter>
                  <SongControls
                    song={currentSong}
                    playing={playing}
                    repeatMode={repeatMode}
                    musicMode={musicMode}
                    onPlay={onPlay}
                    onPause={onPause}
                    onSkipForward={onSkipForward}
                    onSkipBackward={onSkipBackward}
                    onToggleRepeatMode={onToggleRepeatMode}
                    onToggleMusicMode={onToggleMusicMode}
                  />
                  <SongProgressBar
                    song={currentSong}
                    progress={currentSongProgress}
                    onSeek={onSeek}
                  />
                </YoutubePanelFooter>
              )
            }
          </>
        )
      }
    </YoutubePanel>
  )
}

export default SongsPanel
