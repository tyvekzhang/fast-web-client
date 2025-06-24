'use client';
import { useLayoutStore } from '@/stores/layout-store';
import { Layout } from 'antd';
import { Logo } from './logo';
import { NavigationMenu } from './navigation-menu';

const { Sider } = Layout;

export function SiderLayout() {
  const { collapsed, toggleCollapsed } = useLayoutStore();

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={200}
      collapsedWidth={80}
      className="!fixed h-screen z-50"
    >
      <Logo />
      <NavigationMenu />
    </Sider>
  );
}
