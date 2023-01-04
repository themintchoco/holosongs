declare module 'array-filter-inplace' {
  const filter: <T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean, offset?: number) => T[]
  export default filter
}
