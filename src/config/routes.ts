import type { RouteObject } from '@/types/route';

export const basicRoutes: RouteObject[] = [
  {
    path: '/',
    meta: {
      title: '首页',
      affix: true,
      icon: 'Home',
    },
  },
  {
    path: '/dashboard',
    meta: {
      title: '仪表板',
      icon: 'BarChart3',
    },
  },
  {
    path: '/users',
    meta: {
      title: '用户管理',
      icon: 'Users',
    },
  },
  {
    path: '/settings',
    meta: {
      title: '设置',
      icon: 'Settings',
    },
  },
];
