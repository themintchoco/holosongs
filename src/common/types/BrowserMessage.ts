export enum BrowserMessageType {
  tabStatusChange,
  updateComplete,
  languageChanged,
}

export interface BrowserMessageTabStatusChange {
  type: BrowserMessageType.tabStatusChange,
  status: string,
}

export interface BrowserMessageUpdateComplete {
  type: BrowserMessageType.updateComplete,
  previousVersion: string,
}

export interface BrowserMessageLanguageChanged {
  type: BrowserMessageType.languageChanged,
}

export type BrowserMessage = (
  BrowserMessageTabStatusChange |
  BrowserMessageUpdateComplete |
  BrowserMessageLanguageChanged
)
