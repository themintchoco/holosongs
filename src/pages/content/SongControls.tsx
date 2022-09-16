import cx from 'classnames'

import styles from './SongControls.module.scss'
import PlayPauseIcon from './PlayPauseIcon'
import { type Song, RepeatMode, MusicMode } from './Content'
import { MdSkipPrevious, MdSkipNext, MdRepeat, MdRepeatOne, MdMusicNote } from 'react-icons/md'

interface ControlButtonProps {
  onClick?: () => void,
}

const ControlButton = ({ children, onClick } : React.PropsWithChildren<ControlButtonProps>) => {
  return (
    <div className={styles.controlButton} onClick={onClick}>
      { children }
    </div>
  )
}

interface ToggleButtonProps extends ControlButtonProps {
  active?: boolean,
}

const ToggleButton = ({ children, active, onClick } : React.PropsWithChildren<ToggleButtonProps>) => {
  return (
    <div className={cx(styles.toggleButton, { [styles.active]: active })} onClick={onClick}>
      { children }
    </div>
  )
}

export interface SongControlsProps {
  song: Song | null,
  playing: boolean,
  repeatMode: RepeatMode,
  musicMode: MusicMode,
  onPlay?: () => void,
  onPause?: () => void,
  onToggleRepeatMode?: () => void,
  onToggleMusicMode?: () => void,
  onSkipForward?: () => void,
  onSkipBackward?: () => void,
}

const SongControls = ({
  song,
  playing,
  repeatMode,
  musicMode,
  onPlay,
  onPause,
  onToggleRepeatMode,
  onToggleMusicMode,
  onSkipForward,
  onSkipBackward,
} : SongControlsProps) => {
  return (
    <div>
      <span className={styles.songTitle}>{song?.name}</span>
      <span className={styles.songSubtitle}>{song?.original_artist}</span>

      <div className={styles.controlContainer}>
        <ToggleButton onClick={onToggleRepeatMode} active={repeatMode !== RepeatMode.Off}>
          { repeatMode === RepeatMode.One ? <MdRepeatOne size='2em' /> : <MdRepeat size='2em' /> }
        </ToggleButton>

        <ControlButton onClick={onSkipBackward}>
          <MdSkipPrevious size='4em' />
        </ControlButton>

        <ControlButton onClick={playing ? onPause : onPlay}>
          <PlayPauseIcon playing={playing} size='5em' />
        </ControlButton>

        <ControlButton onClick={onSkipForward}>
          <MdSkipNext size='4em' />
        </ControlButton>

        <ToggleButton onClick={onToggleMusicMode} active={musicMode !== MusicMode.Off}>
          <MdMusicNote size='2em' />
        </ToggleButton>
      </div>
    </div>
  )
}

export default SongControls
