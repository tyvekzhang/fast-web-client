import React, { ReactNode } from 'react';

export interface ModelBase {
  id: string;
  create_time: Date;
  update_time?: Date;
}

export interface PageBase {
  currentPage: number;
  pageSize: number;
  count?: boolean;
}

export interface PageData<T> {
  records: T[];
  total_count: number;
}

export interface EditableCellProps<T = any> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number' | 'select' | 'checkbox' | 'date';
  record: T;
  index: number;
  children: ReactNode;
  required?: boolean;
  options?: { value: string | number; label: string }[];
}
