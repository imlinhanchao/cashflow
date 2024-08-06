import { LAYOUT } from '@/router/constant';
export default [
  {
    path: '/bill',
    component: LAYOUT,
    redirect: '/bill/search',
    meta: {
      order: 2,
      icon: 'solar:bill-list-bold',
      title: '账单历史',
    },
    children: [
      {
        path: '/bill/search',
        name: 'BillSearch',
        component: () => import('/@/views/bill/index.vue'),
        meta: {
          title: '账单历史',
        },
      },
    ],
  },
];
