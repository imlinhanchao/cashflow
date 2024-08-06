import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/data',
    component: LAYOUT,
    redirect: '/data/source',
    meta: {
      order: 3,
      icon: 'ph:database-fill',
      title: '数据源',
    },
    children: [
      {
        path: '/data/source',
        name: 'DataSource',
        component: () => import('/@/views/data/index.vue'),
        meta: {
          title: '数据源',
        },
      },
      {
        path: '/data/maker',
        name: 'DataMaker',
        component: () => import('/@/views/data/maker/index.vue'),
        meta: {
          title: '数据源制作',
          hidden: true,
        },
      },
    ],
  },
];
