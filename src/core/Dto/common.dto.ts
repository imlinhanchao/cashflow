export interface QueryRspDto<T> {
  rows: T[],
  total: number,
}

export interface QueryReqDto {
  page: number;
  size: number;
  username?: string;
  [key: string]: any;
}