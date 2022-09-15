import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageOne, messageAll } from '../../common/utils/message'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage()
  }
})

chrome.runtime.onUpdateAvailable.addListener(({ version }) => {
  messageAll({ type: BrowserMessageType.updateAvailable, version })
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status) {
    messageOne(tabId, { type: BrowserMessageType.tabStatusChange, status: changeInfo.status })
  }
})
