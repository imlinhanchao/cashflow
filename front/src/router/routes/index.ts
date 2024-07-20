import type { AppRouteRecordRaw, AppRouteModule } from '@/router/types';

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

import { PageEnum } from '@/enums/pageEnum';
const modules = import.meta.glob<any>('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList, PAGE_NOT_FOUND_ROUTE];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: PageEnum.BASE_LOGIN,
  name: 'Login',
  component: () => import('/@/views/login/Login.vue'),
  meta: {
    title: '登录',
  },
};

// Basic routing without permission
export const basicRoutes = [LoginRoute, RootRoute, PAGE_NOT_FOUND_ROUTE];
