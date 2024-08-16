import { defHttp } from '@/utils/http';

export class Config {
  database = new Database();
  jwtConstants = new JwtConstants();
  salt: string = '';
}

export class Database {
  database: string = 'cashflow';
  host: string = 'localhost';
  username: string = '';
  password: string = '';
  port: number = 3306;
}

export class JwtConstants {
  secret: string = '';
}

/**
 * 新建配置档
  POST /config
  接口ID：191339750
  接口地址：https://app.apifox.com/link/project/2424992/apis/api-191339750
 */
export function initConfig(data: Config) {
  return defHttp.post<string>({ url: '/config', data });
}

/**
 * 获取配置档
 * GET /config
 * 接口ID：198366674
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-198366674
 */
export function getConfig() {
  return defHttp.get<Config>({ url: '/config' });
}

/**
 * 修改配置档
 * POST /api/config/update
 * 接口ID：198511969
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-198511969
 */
export function updateConfig(data: Config) {
  return defHttp.post<string>({ url: '/config/update', data });
}

/**
 * 是否存在配置档
 * GET /api/config/has
 * 接口ID：198511970
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-198511970
 */
export function isConfig() {
  return defHttp.get<boolean>({ url: '/config/has' }, { errorMessageMode: 'none' });
}
