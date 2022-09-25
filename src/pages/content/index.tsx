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

  const getChannelId = async () => {
    const channelAnchorSelector = 'ytd-video-owner-renderer a[href*="channel/UC"]:not([href*="stale=1"])'
    const channelId = /UC[-_0-9A-Za-z]{21}[AQgw]/.exec((await ensureSelector(channelAnchorSelector) as HTMLAnchorElement).href)?.[0]

    // Mark as stale
    document.querySelectorAll(channelAnchorSelector).forEach((el: HTMLAnchorElement) => {
      const url = new URL(el.href)
      url.searchParams.set('stale', '1')

      el.href = url.toString()
    })

    return channelId
  }

  chrome.runtime.onMessage.addListener(async (message: BrowserMessage, sender) => {
    if (sender.id !== chrome.runtime.id) return
    const newVideoId = (new URLSearchParams(window.location.search)).get('v')

    switch (message.type) {
    case BrowserMessageType.tabStatusChange:
      if (message.status !== 'complete' || videoId === newVideoId) return
      break
    case BrowserMessageType.languageChanged:
      i18n.changeLanguage()
      return
    default:
      return
    }

    const player = await ensureSelector('.ytd-player') as HTMLElement
    const channelId = await getChannelId()

    root.render(
      <Content
        player={player}
        videoId={newVideoId}
        channelId={channelId}
        songsPanelContainer={panelContainer}
        dexLinkContainer={linkContainer}
      />
    )

    videoId = newVideoId
  })
})()
