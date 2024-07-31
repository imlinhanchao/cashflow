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

export interface StatisticDto {
  source: Record<string, DataSourceDto>;
  options: any;
}

export interface DataSourceDto {
  field: DataFieldDto[];
  where: any;
}

export interface DataFieldDto {
  field: string;
  label: string;
  fun: SQLFn[];
}

export interface SQLFn {
  name: string;
  params: SQLFnParam[];
  operator: string;
}

export interface SQLFnParam {
  type: 'string' | 'col' | 'fn';
  value: string | SQLFn;
}