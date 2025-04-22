import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageOne, messageAll } from '../../common/utils/message'
import { updateWhitelist } from '../../common/utils/channel-whitelist'
import { ServiceWorkerMessage, ServiceWorkerMessageType } from '../../common/types/ServiceWorkerMessage'

void chrome.storage.local.set({ whitelistUpdating: false })

chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage()
  } else if (reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const activeTabs = await chrome.tabs.query({ url: '<all_urls>' })

    if (previousVersion === '1.0.0') {
      // Release v1.0.0 did not implement an update mechanism, so we'll need to manually remove the old components
      // Remove YoutubePanel and DexLink via their compiled class names
      await Promise.allSettled(activeTabs.map((tab) => tab.id !== undefined && chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.querySelectorAll('.bJwpw5RO98qA7UY6WyUM, .M_ZGC4L_owuKBVoKSvdp').forEach((el) => el.remove())
        },
      })))
    }

    await Promise.allSettled(activeTabs.map((tab) => tab.id !== undefined && chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    })))

    await messageAll({ type: BrowserMessageType.updateComplete, previousVersion: previousVersion ?? '' })
  }
})

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === 'whitelist-updater') {
    void updateWhitelist()
  }
})

chrome.runtime.onMessage.addListener((message: ServiceWorkerMessage, sender) => {
  if (sender.id !== chrome.runtime.id) return

  if (message.type === ServiceWorkerMessageType.updateWhitelist) {
    void updateWhitelist()
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status) {
    void messageOne(tabId, { type: BrowserMessageType.tabStatusChange, status: changeInfo.status })
  }
})
