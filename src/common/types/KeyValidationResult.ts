export enum KeyValidationResultType {
  valid,
  invalid,
  error,
}

export interface KeyValidationResult {
  type: KeyValidationResultType
  message?: string
}
