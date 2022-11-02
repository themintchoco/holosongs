import { useState } from 'react'

import cx from 'classnames'
import format from 'format-duration'

import styles from './SongProgressBar.module.scss'
import type { Song } from './Content'

interface SongProgressBarProps {
  song: Song | null,
  progress: number | null,
  onSeek?: (t: number) => void,
}

const SongProgressBar = ({ song, progress, onSeek } : SongProgressBarProps) => {
  const [mouseoverProgress, setMouseoverProgress] = useState(0)
  const duration = song ? song.end - song.start : 0

  const handleSeekSong: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!song) return

    const rect = e.currentTarget.getBoundingClientRect()
    const t = (e.clientX - rect.left) / rect.width * duration

    switch (e.buttons) {
    case 1:
      onSeek?.(t)
      // fallthrough
    case 0:
      setMouseoverProgress(t)
    }
  }

  return (
    <div className={styles.container}>
      { song && <span>{ format((progress ?? 0) * 1000) }</span> }

      <div
        className={styles.barOuter}
        onMouseDown={handleSeekSong}
        onMouseMove={handleSeekSong}>
        <div className={cx(styles.bar, { [styles.pulsing]: !song })}>
          <div className={styles.fill} style={{width: song ? `${(progress ?? 0) / duration * 100}%` : 0}}></div>
          <div className={styles.dot}></div>
          <div className={styles.ghost} style={{width: `calc(${(mouseoverProgress - (progress ?? 0)) / duration * 100}% - 6px)`}}></div>
        </div>
      </div>

      { song && <span>{ format(duration * 1000) }</span> }
    </div>
  )
}

export default SongProgressBar

