import { defHttp } from '@/utils/http';
import { EnumFieldRsp, EnumQuery, IPageParam } from './common';
import { DataSource } from './data';

export interface IMailAccount {
  /**
   * 密码
   */
  password: string;
  /**
   * 用户名
   */
  username: string;
}

/**
 * CashflowDto
 */
export class Cashflow {
  id?: string;
  /**
   * 金额
   */
  amount: number = 0;
  /**
   * 交易分类
   */
  category: string = '';
  /**
   * 交易对方
   */
  counterparty: string = '';
  /**
   * 交易说明
   */
  description: string = '';
  /**
   * 来源
   */
  from: string = '';
  /**
   * 商家订单号
   */
  merchantNumber: string = '';
  /**
   * 交易订单号
   */
  orderNumber: string = '';
  /**
   * 支付方式
   */
  payment: string = '';
  /**
   * 备注
   */
  remark: string = '';
  /**
   * 交易状态
   */
  status: string = '支付成功';
  /**
   * 交易时间
   */
  transactionTime: string = '';
  /**
   * 收/支
   */
  type: string = '支出';
}

/**
 * SyncDto
 */
export interface ISyncConfig {
  /**
   * 对账单文件
   */
  files?: File[];
  /**
   * 解压密码
   */
  password?: string;
  /**
   * 同步类型
   */
  type: string;
}

/**
 * 连接邮箱
 * POST /mail/connect
 * 接口ID：191344455
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344455
 */
export function connectMail(data: IMailAccount) {
  return defHttp.post<any>({ url: '/mail/connect', params: data });
}

/**
 * 停止邮箱
 * POST /mail/stop
 * 接口ID：191344457
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344457
 */
export function stopMail() {
  return defHttp.post<any>({ url: '/mail/stop' });
}

/**
 * 新建交易项目
 * POST /cashflow/create
 * 接口ID：191344476
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344476
 */
export function create(data: Cashflow[]) {
  return defHttp.post<any>({ url: '/cashflow/create', params: data });
}

/**
 * 同步交易记录
 * POST /cashflow/analysis
 * 接口ID：191425359
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191425359
 */
export function analysis(data: ISyncConfig) {
  return defHttp.post<any>({ url: '/cashflow/analysis', params: data });
}

/**
 * 同步文件交易记录
 * POST /cashflow/analysisFile
 * 接口ID：196008554
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-196008554
 */
export function analysisFile(sync: ISyncConfig) {
  const data = new FormData();
  data.append('type', sync.type);
  sync.files?.forEach((file) => data.append('files', file));
  return defHttp.post<any>({ url: '/cashflow/analysisFile', data });
}

/**
 * 更新交易项目
 * PUT /cashflow/{id}
 * 接口ID：191344477
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344477
 */
export function update(id: string, data: Cashflow) {
  return defHttp.put<any>({ url: `/cashflow/${id}`, params: data });
}

/**
 * 获取交易明细
 * GET /cashflow/{id}
 * 接口ID：191344478
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344478
 */
export function detail(id: string) {
  return defHttp.get<any>({ url: `/cashflow/${id}` });
}

/**
 * 删除交易记录
 * DELETE /cashflow/{id}
 * 接口ID：191344479
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344479
 */
export function remove(id: string) {
  return defHttp.delete<any>({ url: `/cashflow/${id}` });
}

/**
 * 搜索交易记录
 * GET /cashflow/query
 * 接口ID：191344480
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-191344480
 */
export function search(params: any & IPageParam) {
  Object.keys(params).forEach((k) => {
    if (Array.isArray(params[k])) params[k] = params[k].join(',');
  });
  return defHttp.get<any>({ url: '/cashflow/search', params });
}

/**
 * 检索字段枚举值
 * GET /cashflow/enum
 * 接口ID：198437800
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-198437800
 */
export function enumField(params: EnumQuery) {
  return defHttp.get<EnumFieldRsp[]>({ url: '/cashflow/enum', params });
}

/**
 * 高级搜索
 * POST /cashflow/where
 * 接口ID：200667898
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-200667898
 */
export function advancedSearch(data: DataSource)  {
  return defHttp.post<any[]>({ url: '/cashflow/where', data });
}