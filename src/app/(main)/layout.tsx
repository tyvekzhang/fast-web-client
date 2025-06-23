"use client"
import { Layout } from 'antd';
import { useLayoutStore } from '@/stores/layout-store';
import { HeaderLayout, SiderLayout } from '@/components/layout';

const { Content } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useLayoutStore();

  return (
    <Layout className="min-h-screen">
      <SiderLayout />
      <Layout>
        <HeaderLayout />
        <Content
          className={`p-6 transition-all duration-200 ${
            collapsed ? 'ml-[80px]' : 'ml-[200px]'
          }`}
        >
          <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-152px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
