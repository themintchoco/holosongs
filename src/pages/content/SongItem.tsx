import cx from 'classnames'

import styles from './SongItem.module.scss'
import type { Song } from './Content'

export interface SongItemProps {
  song: Song,
  active?: boolean,
  onSelectSong?: (song: Song) => void,
}

const SongItem = ({ song, active, onSelectSong } : SongItemProps) => {
  return (
    <div className={cx(styles.songItem, { [styles.active]: active })} onClick={() => onSelectSong?.(song)}>
      <div className={cx(styles.art, { [styles.placeholder]: !song.art })} style={{backgroundImage: `url("${song.art ?? chrome.runtime.getURL('assets/icons/placeholder.png')}")`}}></div>
      <div className={styles.details}>
        <h3>{song.name}</h3>
        <h4 className={styles.secondary}>{song.original_artist}</h4>
      </div>
    </div>
  )
}

export default SongItem
