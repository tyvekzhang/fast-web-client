"use client"
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

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
