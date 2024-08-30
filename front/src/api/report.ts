import { defHttp } from '@/utils/http';
import { DataSource } from './data';
import { IPageParam } from './common';

export class Report {
  name = '';
  description = '';
  datasrcId?: string;
  datasrc: DataSource = new DataSource();
  options: string = 'option = {\n}';
  public: boolean = false;
}

export interface IReport extends Report {
  id: string;
  createAt: string;
  updateAt: string;
}

/**
 * 新建报表配置
 * POST /api/report/create
 * 接口ID：210494529
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210494529
 */
export function createReport(data: Report[]) {
  return defHttp.post({ url: '/report/create', data });
}

/**
 * 更新报表配置
 * PUT /api/report/{id}
 * 接口ID：210494530
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210494530
 */
export function updateReport(id: string, data: Report) {
  return defHttp.put({ url: `/report/${id}`, data });
}

/**
 * 删除报表配置
 * DELETE /api/report/{id}
 * 接口ID：210494531
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210494531
 */
export function deleteReport(id: string) {
  return defHttp.delete({ url: `/report/${id}` });
}

/**
 * 获取报表配置
 * GET /api/report/get/{id}
 * 接口ID：210494532
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210494532
 */
export function getReport(id: string) {
  return defHttp.get({ url: `/report/get/${id}` });
}

/**
 * 搜索报表配置
 * GET /api/report/search
 * 接口ID：210494533
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210494533
 */
export function searchReport(params: any & IPageParam) {
  Object.keys(params).forEach((k) => {
    if (Array.isArray(params[k])) params[k] = params[k].join(',');
  });
  return defHttp.get({ url: '/report/search', params });
}
