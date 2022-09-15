import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import styles from './DexLink.module.scss'
import HolodexLogo from '../../assets/icons/HolodexLogo.svg'

export interface DexLinkProps {
  onClick?: () => void,
}

const DexLink = ({ onClick } : DexLinkProps) => {
  const { t } = useTranslation('content')

  return (
    <button
      className={cx(styles.dexlinkBtn, 'ytp-button')}
      onClick={onClick}
      title={t('dexLink.title')}>
      <HolodexLogo width='2em' height='2em' />
    </button>
  )
}

export default DexLink
