import type { PaginationProps, TableProps } from 'antd';
import { Pagination, Table } from 'antd';
import React from 'react';

interface PaginatedTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  total: number;
  current: number;
  page_size: number;
  onPaginationChange: (current: number, page_size: number) => void;
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  rowSelectionType?: 'checkbox' | 'radio';
  selectedRowKeys?: React.Key[];
  loading: boolean;
}

export function PaginatedTable<T extends object>({
  total,
  current,
  page_size,
  onPaginationChange,
  onSelectionChange,
  rowSelectionType = 'checkbox',
  rowSelection: propRowSelection,
  selectedRowKeys,
  loading,
  ...tableProps
}: PaginatedTableProps<T>) {
  const rowSelection: TableProps<T>['rowSelection'] = {
    type: rowSelectionType,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: T[]) => {
      onSelectionChange?.(newSelectedRowKeys, selectedRows);
    },
    ...(propRowSelection as TableProps<T>['rowSelection']),
  };

  const handlePaginationChange: PaginationProps['onChange'] = (
    newCurrent,
    newpage_size,
  ) => {
    onPaginationChange(newCurrent, newpage_size);
  };

  return (
    <div className="flex flex-col">
      <Table
        {...tableProps}
        pagination={false}
        rowKey={tableProps.rowKey || 'id'}
        rowSelection={rowSelection}
        className={`${tableProps.className || ''}`}
        loading={loading}
      />
      <div className="mt-4 py-4">
        <Pagination
          current={current}
          pageSize={page_size}
          total={total}
          showTotal={(total) => `共${total}条`}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          showSizeChanger
          showQuickJumper
          onChange={handlePaginationChange}
          className="flex justify-end"
        />
      </div>
    </div>
  );
}
