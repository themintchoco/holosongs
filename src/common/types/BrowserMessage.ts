export enum BrowserMessageType {
  tabStatusChange,
  updateAvailable,
  languageChanged,
}

export interface BrowserMessageTabStatusChange {
  type: BrowserMessageType.tabStatusChange,
  status: string,
}

export interface BrowserMessageUpdateAvailable {
  type: BrowserMessageType.updateAvailable,
  version: string,
}

export interface BrowserMessageLanguageChanged {
  type: BrowserMessageType.languageChanged,
}

export type BrowserMessage = (
  BrowserMessageTabStatusChange |
  BrowserMessageUpdateAvailable |
  BrowserMessageLanguageChanged
)
