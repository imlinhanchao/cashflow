import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/sync',
    component: LAYOUT,
    redirect: '/sync/data',
    meta: {
      order: 1,
      icon: 'mdi:cloud-sync',
      title: '同步账单',
    },
    children: [
      {
        path: 'data',
        name: 'DataSync',
        component: () => import('/@/views/sync/index.vue'),
        meta: {
          title: '同步账单',
        },
      },
    ],
  },
];
