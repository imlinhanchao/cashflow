export interface QueryRspDto<T> {
  data: T[],
  total: number,
}