import styles from './SongItem.module.scss'
import type { Song } from './Content'

export interface SongItemProps {
  song: Song,
  onSelectSong?: (song: Song) => void,
}

const SongItem = ({ song, onSelectSong } : SongItemProps) => {
  return (
    <div className={styles.songItem} onClick={() => onSelectSong?.(song)}>
      <div className={styles.art} style={{background: `var(--yt-spec-10-percent-layer) center/cover url('${song.art}')`}}></div>
      <div className={styles.details}>
        <h3>{song.name}</h3>
        <h4 className={styles.secondary}>{song.original_artist}</h4>
      </div>
    </div>
  )
}

export default SongItem
