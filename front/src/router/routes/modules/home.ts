import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/',
    component: LAYOUT,
    redirect: '/home',
    meta: {
      orderNo: 0,
      icon: 'i-ph:coin-vertical-fill',
      title: '首页',
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('/@/views/home/home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'home/edit',
        name: 'HomeEdit',
        component: () => import('/@/views/home/edit.vue'),
        meta: {
          title: '编辑首页',
          hidden: true,
        },
      },
    ],
  },
];
