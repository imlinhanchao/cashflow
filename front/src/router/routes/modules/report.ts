import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/report',
    component: LAYOUT,
    redirect: '/report/list',
    meta: {
      order: 4,
      icon: 'i-fluent:data-trending-20-filled',
      title: '统计报表',
    },
    children: [
      {
        path: '/report/list',
        name: 'ReportList',
        component: () => import('/@/views/report/index.vue'),
        meta: {
          title: '统计报表',
        },
      },
      {
        path: '/report/maker',
        name: 'ReportMaker',
        component: () => import('/@/views/report/maker/index.vue'),
        meta: {
          title: '统计报表制作器',
          hidden: true,
        },
      },
      {
        path: ':id',
        name: 'DataDetail',
        component: () => import('/@/views/report/maker/index.vue'),
        meta: {
          title: '统计报表详情',
          hidden: true,
        },
      },
    ],
  },
];
