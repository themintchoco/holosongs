import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageOne, messageAll } from '../../common/utils/message'
import { updateWhitelist } from '../../common/utils/channel-whitelist'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage()
  }
})

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === 'whitelist-updater') {
    void updateWhitelist()
  }
})

chrome.runtime.onUpdateAvailable.addListener(({ version }) => {
  void messageAll({ type: BrowserMessageType.updateAvailable, version })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status) {
    void messageOne(tabId, { type: BrowserMessageType.tabStatusChange, status: changeInfo.status })
  }
})
