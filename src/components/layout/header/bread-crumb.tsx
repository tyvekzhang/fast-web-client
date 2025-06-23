'use client';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

export function BreadCrumb() {
  return (
    <Breadcrumb
      items={[
        {
          href: '/',
          title: <HomeOutlined />,
        },
        {
          href: '',
          title: 'Application',
        },
      ]}
    />
  );
}
