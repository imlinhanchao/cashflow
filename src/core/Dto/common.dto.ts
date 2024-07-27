export interface QueryRspDto<T> {
  rows: T[],
  total: number,
}