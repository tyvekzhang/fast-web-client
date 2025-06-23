"use client"
import { Layout, LayoutProps } from 'antd';
import { BreadCrumb } from './bread-crumb';
import { Support } from './support';
import { UserDropdown } from './user-dropdown';
import { JSX } from 'react';

const { Header } = Layout;

export function HeaderLayout(props: LayoutProps): JSX.Element {
  return (
    <Header className="bg-white flex items-center justify-between px-6 border-b">
      <BreadCrumb />
      <div className="flex items-center gap-4">
        <Support />
        <UserDropdown />
      </div>
    </Header>
  );
}
