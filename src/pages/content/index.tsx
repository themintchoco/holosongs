import { createRoot } from 'react-dom/client'

import i18n from '../../common/i18next'

import { BrowserMessageType, type BrowserMessage } from '../../common/types/BrowserMessage'
import { ensureSelector, injectElement } from '../../common/utils/dom-watch'
import Content from './Content'

(async () => {
  const root = createRoot(document.createElement('div'))
  const panelContainer = document.createElement('div')
  const linkContainer = document.createElement('span')

  injectElement(panelContainer, 'afterbegin', 'div#panels')
  injectElement(linkContainer, 'afterbegin', '.ytp-right-controls')

  let videoId: string | null = null

  chrome.runtime.onMessage.addListener(async (message: BrowserMessage, sender) => {
    if (sender.id !== chrome.runtime.id) return
    
    const id = (new URLSearchParams(window.location.search)).get('v')

    switch (message.type) {
    case BrowserMessageType.tabStatusChange:
      if (message.status !== 'complete' || id === videoId) return
      videoId = id
      break
    case BrowserMessageType.languageChanged:
      i18n.changeLanguage()
      return
    default:
      return
    }

    const player = await ensureSelector('.ytd-player') as HTMLElement

    root.render(
      <Content
        player={player}
        videoId={id}
        songsPanelContainer={panelContainer}
        dexLinkContainer={linkContainer}
      />
    )
  })
})()
