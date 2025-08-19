'use client';
import FoldTrigger from '@/components/layout/header/fold-trigger';
import { Layout } from 'antd';
import { JSX } from 'react';
import { BreadcrumbLayout } from './bread-crumb';
import Support from './support';
import TagsLayout from './tags';
import { UserDropdown } from './user-dropdown';

const { Header } = Layout;

export function HeaderLayout(): JSX.Element {
  return (
    <div className="bg-gray-50 border-b border-gray-200 mb-1 shadow-2xs">
      <Header className="px-6 h-14 bg-gray-50 flex items-center justify-between border-gray-200 border-b-1">
        <div className="flex items-center justify-start">
          <FoldTrigger />
          <BreadcrumbLayout />
        </div>
        <div className="flex items-center gap-4">
          <Support />
          <UserDropdown />
        </div>
      </Header>
      <div className="px-6 py-1">
        <TagsLayout />
      </div>
    </div>
  );
}
