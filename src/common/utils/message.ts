import type { BrowserMessage } from '../../common/types/BrowserMessage'

export const messageOne = async (tabId: number, message: BrowserMessage) => {
  return chrome.tabs.sendMessage(tabId, message).catch(() => null)
}

export const messageAll = async (message: BrowserMessage) => {
  const tabs = await chrome.tabs.query({ url: '<all_urls>' })
  return Promise.allSettled(tabs.map(tab => tab.id !== undefined && chrome.tabs.sendMessage(tab.id, message)))
}
