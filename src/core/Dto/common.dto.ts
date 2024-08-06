import { ApiProperty } from "@nestjs/swagger";

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

export class SQLFn {
  @ApiProperty({ name: 'name', description: '函数名' })
  name: string;
  @ApiProperty({ name: 'params', description: '函数参数' })
  params: SQLFnParam[];
}

export class SQLFnParam {
  @ApiProperty({ name: 'type', description: '参数类型' })
  type: 'value' | 'col' | 'fn';
  @ApiProperty({ name: 'value', description: '参数值' })
  value: string | number | boolean | SQLFn;
}

export class SQLWhereDto {
  @ApiProperty({ name: 'relational', description: '关系' })
  relational: 'and' | 'or';
  @ApiProperty({ name: 'items', description: '条件' })
  items: (SQLWhereItem | SQLWhereDto)[];
}

export type SQLWhereItem = Record<string, any>;

export class DataFieldDto {
  @ApiProperty({ name: 'field', description: '字段名' })
  field: string;
  @ApiProperty({ name: 'label', description: '字段显示名' })
  label: string;
  @ApiProperty({ name: 'fun', description: '字段函数' })
  fun?: SQLFn;
}


export class DataOrderDto {
  @ApiProperty({ name: 'field', description: '字段名' })
  field: string;
  @ApiProperty({ name: 'fun', description: '字段函数' })
  fun?: SQLFn;
  @ApiProperty({ name: 'order', description: '排序方式' })
  order: 'ASC' | 'DESC';
}

export class DataSourceDto {
  @ApiProperty({ name: 'fields', description: '查询显示字段' })
  fields: DataFieldDto[];
  @ApiProperty({ name: 'where', description: '查询 SQL Where 条件' })
  where?: SQLWhereDto;
  @ApiProperty({ name: 'order', description: '查询排序字段' })
  order?: DataOrderDto[];
  @ApiProperty({ name: 'group', description: '查询分组字段' })
  group?: string[];
  @ApiProperty({ name: 'index', description: '起始 index' })
  index?: number;
  @ApiProperty({ name: 'count', description: '查询数量' })
  count?: number;
}

export class SearchField {
  @ApiProperty({ name: 'fields', description: '查询字段' })
  field: string;
  @ApiProperty({ name: 'label', description: '字段显示名' })
  label: string;
  @ApiProperty({ name: 'component', description: '组件名' })
  component: string;
  @ApiProperty({ name: 'attrs', description: '组件属性' })
  attrs: Record<string, any>;
}

export class StatisticDto {
  @ApiProperty({ name: 'source', description: '数据源' })
  source: Record<string, DataSourceDto>;
  @ApiProperty({ name: 'search', description: '搜索字段' })
  search: SearchField[];
  @ApiProperty({ name: 'options', description: 'echart配置' })
  options: any;
}
