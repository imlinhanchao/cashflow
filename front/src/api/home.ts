import { defHttp } from '@/utils/http';
import { IReport } from './report';

/**
 * HomeDto
 */
export class Home {
  /**
   * 列号
   */
  x: number = 0;

  /**
   * 行号
   */
  y: number = 0;

  /**
   * 高度
   */
  h: number = 0;

  /**
   * 宽度
   */
  w: number = 0;

  /**
   * 统计报表Id
   */
  reportId: string = '0';

  /**
   * 索引
   */
  i: string = '';
}

export interface IHome extends Home {
  id: string;
  report: IReport;
  createAt: string;
  updateAt: string;
}

/**
 * 保存首页配置
 * PUT /api/home/save
 * 接口ID：210666755
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210666755
 */
export function saveHome(data: Home[]) {
  return defHttp.post({ url: '/home/save', data });
}

/**
 * 获取首页配置
 * GET /api/home/get
 * 接口ID：210575276
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-210575276
 */
export function getHome() {
  return defHttp.get<IHome[]>({ url: '/home/get' });
}