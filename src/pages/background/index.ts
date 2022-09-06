import { BrowserMessageType } from '../../common/types/BrowserMessage'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage()
  }
})

chrome.runtime.onUpdateAvailable.addListener(async ({ version }) => {
  const tabs = await chrome.tabs.query({ url: '<all_urls>' })
  Promise.allSettled(tabs.map(tab => chrome.tabs.sendMessage(tab.id, { type: BrowserMessageType.updateAvailable, version })))
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status) {
    chrome.tabs.sendMessage(tabId, { type: BrowserMessageType.tabStatusChange, status: changeInfo.status })
      .catch(() => null)
  }
})
