import cx from 'classnames'

import styles from './YoutubePanel.module.scss'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'

export interface YoutubePanelHeaderProps {
  title: string,
  isCollapsed?: boolean,
  onToggleCollapsed?: () => void,
}

export const YoutubePanelHeader = ({ title, isCollapsed, onToggleCollapsed } : YoutubePanelHeaderProps) => {
  return (
    <div id='header' className='ytd-engagement-panel-title-header-renderer'>
      <div id='title-container' className='ytd-engagement-panel-title-header-renderer'>
        <h2 id='title' className='ytd-engagement-panel-title-header-renderer'>{ title }</h2>
      </div>
      {
        isCollapsed !== undefined && (
          <div className={cx(styles.collapseBtn)} onClick={onToggleCollapsed}>
            { isCollapsed ? <MdExpandMore size='3em' /> : <MdExpandLess size='3em' /> }
          </div>
        )
      }
    </div>
  )
}

export const YoutubePanelListContent = ({ children } : React.PropsWithChildren) => {
  return (
    <div className='ytd-engagement-panel-section-list-renderer' id='content'>
      <div className={cx(styles.listContent, 'ytd-macro-markers-list-renderer')} id='contents'>
        { children }
      </div>
    </div>
  )
}

export const YoutubePanelFooter = ({ children } : React.PropsWithChildren) => {
  return (
    <div className={styles.footer}>
      { children }
    </div>
  )
}

const YoutubePanel = ({ children } : React.PropsWithChildren) => {
  return (
    <div className={styles.panel}>
      { children }
    </div>
  )
}

export default YoutubePanel
