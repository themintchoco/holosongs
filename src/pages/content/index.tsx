import { createRoot } from 'react-dom/client'

import i18n from '../../common/i18next'

import { BrowserMessageType, type BrowserMessage } from '../../common/types/BrowserMessage'
import { ensureSelector, injectElement } from '../../common/utils/dom-watch'
import Content from './Content'

const root = createRoot(document.createElement('div'))
const panelContainer = document.createElement('div')
const linkContainer = document.createElement('span')

injectElement(panelContainer, 'afterbegin', 'div#panels')
injectElement(linkContainer, 'afterbegin', '.ytp-right-controls')

let videoId: string | null = null

const getChannelId = async () => {
  const channelAnchorSelector = 'ytd-video-owner-renderer a[href]:not([href*="stale=1"])'
  const channelURL = (await ensureSelector(channelAnchorSelector) as HTMLAnchorElement).href
  const channelId = /UC[-_0-9A-Za-z]{21}[AQgw]/.exec(channelURL)?.[0] ?? null

  // Mark as stale
  document.querySelectorAll(channelAnchorSelector).forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      const url = new URL(el.href)
      url.searchParams.set('stale', '1')

      el.href = url.toString()
    }
  })

  // Fallback to fetch request if vanity URL
  return channelId ?? fetch(channelURL)
    .then((r) => r.text())
    .then((html) => {
      return /UC[-_0-9A-Za-z]{21}[AQgw]/.exec(html)?.[0] ?? null
    })
}

chrome.runtime.onMessage.addListener(async (message: BrowserMessage, sender) => {
  if (sender.id !== chrome.runtime.id) return
  const newVideoId = (new URLSearchParams(window.location.search)).get('v')

  switch (message.type) {
  case BrowserMessageType.tabStatusChange:
    if (message.status !== 'complete' || videoId === newVideoId) return
    videoId = newVideoId
    break
  case BrowserMessageType.languageChanged:
    void i18n.changeLanguage()
    return
  default:
    return
  }

  root.render(<></>)
  if (!videoId) return

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
})
