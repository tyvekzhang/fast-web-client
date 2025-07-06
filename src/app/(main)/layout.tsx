'use client';
import { HeaderLayout, SiderLayout } from '@/components/layout';
import { Layout } from 'antd';
import React from 'react';

const { Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="min-h-screen">
      <SiderLayout />
      <Layout>
        <HeaderLayout />
        <Content className="transition-all duration-200 bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
