import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/data',
    component: LAYOUT,
    redirect: '/data/sync',
    meta: {
      order: 1,
      icon: 'mdi:cloud-sync',
      title: '同步账单',
    },
    children: [
      {
        path: 'sync',
        name: 'DataSync',
        component: () => import('/@/views/sync/index.vue'),
        meta: {
          order: 1,
          icon: 'mdi:cloud-sync',
          title: '同步账单',
        },
      },
    ],
  },
];
