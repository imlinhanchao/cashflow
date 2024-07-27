import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/list',
    component: LAYOUT,
    redirect: '/data/list',
    meta: {
      order: 2,
      icon: 'solar:bill-list-bold',
      title: '账单历史',
    },
    children: [
      {
        path: '/data/list',
        name: 'DataList',
        component: () => import('/@/views/list/index.vue'),
        meta: {
          title: '账单历史',
        },
      },
    ],
  },
];
