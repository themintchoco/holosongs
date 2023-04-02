import { createRoot } from 'react-dom/client'

import i18n from '../../common/i18next'

import { BrowserMessageType, type BrowserMessage } from '../../common/types/BrowserMessage'
import { ejectElement, ensureSelector, injectElement } from '../../common/utils/dom-watch'
import Content from './Content'

const root = createRoot(document.createElement('div'))
const panelContainer = document.createElement('div')
const linkContainer = document.createElement('span')

injectElement(panelContainer, 'afterbegin', 'div#panels')
injectElement(linkContainer, 'afterbegin', '.ytp-right-controls')

let videoId: string | null = null

const getChannelId = async (ignoreStale = false) => {
  const channelAnchorSelector = `ytd-video-owner-renderer a[href]${ignoreStale ? '' : ':not([href*="stale=1"])'}`
  const channelURL = (await ensureSelector(channelAnchorSelector) as HTMLAnchorElement).href

  let channelId: string | null = null

  document.querySelectorAll(channelAnchorSelector).forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      channelId = /UC[-_0-9A-Za-z]{21}[AQgw]/.exec(el.href)?.[0] ?? null

      // Mark as stale
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
  case BrowserMessageType.updateComplete:
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
  const channelId = await getChannelId(message.type === BrowserMessageType.updateComplete)

  root.render(
    <Content
      player={player}
      videoId={videoId}
      channelId={channelId}
      songsPanelContainer={panelContainer}
      dexLinkContainer={linkContainer}
    />
  )
})

// Ensure single instance
dispatchEvent(new CustomEvent('holosongs-loaded'))

addEventListener('holosongs-loaded', () => {
  ejectElement(panelContainer)
  ejectElement(linkContainer)
  root.unmount()
}, { once: true })
