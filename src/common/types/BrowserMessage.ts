export enum BrowserMessageType {
  tabStatusChange,
  updateAvailable,
}

export interface BrowserMessageTabStatusChange {
  type: BrowserMessageType.tabStatusChange,
  status: string,
}

export interface BrowserMessageUpdateAvailable {
  type: BrowserMessageType.updateAvailable,
  version: string,
}

export type BrowserMessage = BrowserMessageTabStatusChange | BrowserMessageUpdateAvailable
