'use client';

import NavigationMenu from '@/components/layout/sider/navigation-menu';
import { useLayoutStore } from '@/stores/layout-store';
import { Layout } from 'antd';
import { Logo } from './logo';

const { Sider } = Layout;

export function SiderLayout() {
  const { collapsed, toggleCollapsed } = useLayoutStore();

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      className="min-h-screen"
    >
      <Logo />
      <NavigationMenu />
    </Sider>
  );
}
