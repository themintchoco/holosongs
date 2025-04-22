export enum ServiceWorkerMessageType {
  updateWhitelist,
}

export interface ServiceWorkerMessageUpdateWhitelist {
  type: ServiceWorkerMessageType.updateWhitelist
}

export type ServiceWorkerMessage = (
  ServiceWorkerMessageUpdateWhitelist
)
