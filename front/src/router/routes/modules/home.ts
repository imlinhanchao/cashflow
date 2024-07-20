import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/',
    component: LAYOUT,
    redirect: '/home',
    meta: {
      orderNo: 0,
      icon: 'ph:coin-vertical-fill',
      title: '首页',
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('/@/views/home/Home.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
];
