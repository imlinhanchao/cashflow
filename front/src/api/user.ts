import { defHttp } from '@/utils/http';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/auth/profile',
  GetPermCode = '/getPermCode',
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 用户id
  id: string | number;
  // 用户名
  username: string;
  // 真实名字
  nickname: string;
  // 邮箱
  email: string;
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * /users/register
 * POST /users/register
 * 接口ID：67732796
 * 接口地址：https://app.apifox.com/link/project/2424992/apis/api-67732796
 */
export interface RegisterParams {
  username: string;
  password: string;
  email: string;
}

export function registerApi(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: '/users/register',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function doLogout() {
  return '';
}
