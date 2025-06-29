import type { PaginationProps, TableProps } from 'antd';
import { Pagination, Table } from 'antd';
import React from 'react';

interface PaginatedTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  total: number;
  current: number;
  pageSize: number;
  onPaginationChange: (current: number, pageSize: number) => void;
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  rowSelectionType?: 'checkbox' | 'radio';
  selectedRowKeys?: React.Key[];
}

export function PaginatedTable<T extends object>({
  total,
  current,
  pageSize,
  onPaginationChange,
  onSelectionChange,
  rowSelectionType = 'checkbox',
  rowSelection: propRowSelection,
  selectedRowKeys,
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

  const handlePaginationChange: PaginationProps['onChange'] = (newCurrent, newPageSize) => {
    onPaginationChange(newCurrent, newPageSize);
  };

  return (
    <div className="flex flex-col">
      <Table
        {...tableProps}
        pagination={false}
        rowKey={tableProps.rowKey || 'id'}
        rowSelection={rowSelection}
        className={`min-h-[400px] ${tableProps.className || ''}`}
      />
      <div className="mt-4">
        <Pagination
          current={current}
          pageSize={pageSize}
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
