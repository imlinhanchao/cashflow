import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/sync',
    component: LAYOUT,
    redirect: '/sync/data',
    meta: {
      orderNo: 0,
      icon: 'mdi:cloud-sync',
      title: '同步账单',
    },
    children: [
      {
        path: 'data',
        name: 'DataSync',
        component: () => import('/@/views/async/index.vue'),
        meta: {
          title: '同步账单',
        },
      },
    ],
  },
];
