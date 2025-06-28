'use client';
import { HeaderLayout, SiderLayout } from '@/components/layout';
import { useLayoutStore } from '@/stores/layout-store';
import { Layout } from 'antd';
import React from 'react';

const { Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useLayoutStore();

  return (
    <Layout className="min-h-screen">
      <SiderLayout />
      <Layout>
        <HeaderLayout />
        <Content className="p-6 transition-all duration-200 bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
