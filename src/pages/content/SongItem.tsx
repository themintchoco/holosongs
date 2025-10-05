import cx from 'classnames'

import styles from './SongItem.module.scss'
import useStorage from '../../hooks/useStorage'
import type { Song } from './Content'

export interface SongItemProps {
  song: Song,
  active?: boolean,
  played?: boolean,
  onSelectSong?: (song: Song) => void,
}

const SongItem = ({ song, active, played, onSelectSong } : SongItemProps) => {
  const [fadePlayedSongs] = useStorage('fadePlayedSongs', false)

  return (
    <div className={cx(styles.songItem, { [styles.active]: active })} onClick={() => onSelectSong?.(song)}>
      <div className={cx(styles.art, { [styles.placeholder]: !song.art })} style={{backgroundImage: `url("${song.art ?? chrome.runtime.getURL('assets/icons/placeholder.png')}")`}}></div>
      <div className={cx(styles.details, { [styles.played]: fadePlayedSongs && played && !active })}>
        <h3>{song.name}</h3>
        <h4 className={styles.secondary}>{song.original_artist}</h4>
      </div>
    </div>
  )
}

export default SongItem
