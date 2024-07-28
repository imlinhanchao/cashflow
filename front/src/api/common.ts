export class IPageParam {
  page = 1;
  size = 50;
}

export class EnumQuery {
  /**
   * 字段名
   */
  key = '';
  /**
   * 字段名
   */
  value = '';
  /**
   * 返回数量
   */
  size = 8;
  
  constructor(key: string, value: string='') {
    this.key = key;
    this.value = value;
  }
}

export interface EnumFieldRsp {
  value: string;
  total: number;
}