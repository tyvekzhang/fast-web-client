"use client"

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import * as AntdIcons from '@ant-design/icons';
import Link from 'next/link';
import { useLayoutStore } from '@/stores/layout-store';

type MenuItem = Required<MenuProps>['items'][number];

interface MenuConfigItem {
  key: string;
  label: string;
  path?: string;
  icon?: keyof typeof AntdIcons;
  children?: MenuConfigItem[];
  permissions?: string[]; // Optional permission control
}

const menuConfig: MenuConfigItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'DashboardOutlined',
  },
  {
    key: 'users',
    label: 'Users',
    path: '/users',
    icon: 'UserOutlined',
  },
  {
    key: 'products',
    label: 'Products',
    path: '/products',
    icon: 'ShoppingCartOutlined',
  },
  {
    key: 'documents',
    label: 'Documents',
    icon: 'FileOutlined',
    children: [
      {
        key: 'templates',
        label: 'Templates',
        path: '/documents/templates',
      },
      {
        key: 'guides',
        label: 'Guides',
        path: '/documents/guides',
      },
    ],
  },
  {
    key: 'team',
    label: 'Team',
    icon: 'TeamOutlined',
    children: [
      {
        key: 'members',
        label: 'Members',
        path: '/team/members',
      },
      {
        key: 'roles',
        label: 'Roles',
        path: '/team/roles',
      },
    ],
  },
];

// 修复图标解析
const getAntIcon = (iconName?: keyof typeof AntdIcons) => {
  if (!iconName) return null;
  const AntdIcon = AntdIcons[iconName] as React.FC;
  return AntdIcon ? <AntdIcon /> : null;
};

const transformMenuItems = (config: MenuConfigItem[]): MenuItem[] => {
  return config.map(item => ({
    key: item.key,
    icon: getAntIcon(item.icon),
    label: item.path ? <Link href={item.path}>{item.label}</Link> : item.label,
    children: item.children ? transformMenuItems(item.children) : undefined,
  }));
};

export function NavigationMenu() {
  const { collapsed } = useLayoutStore();
  const items = transformMenuItems(menuConfig);

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={['dashboard']}
      mode="inline"
      items={items}
      className="border-none"
      inlineCollapsed={collapsed}
    />
  );
}
