import cx from 'classnames'

import styles from './PlayPauseIcon.module.scss'

export interface PlayPauseIconProps {
  playing?: boolean,
  size?: string | number,
}

const PlayPauseIcon = ({ playing, size = '1em' } : PlayPauseIconProps) => {
  return (
    <div
      className={cx(styles.icon, { [styles.playing]: playing })}
      style={{width: size, height: size}}>
    </div>
  )
}

export default PlayPauseIcon
