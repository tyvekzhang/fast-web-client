import { Checkbox, Space } from 'antd';
import React from 'react';

interface ColumnVisibilityControlProps {
  columns: { key: number; title: string }[];
  visibleColumns: string[];
  onToggleColumnVisibility: (columnKey: number) => void;
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  columns,
  visibleColumns,
  onToggleColumnVisibility,
}) => {
  const filteredColumns = columns.filter((column) => column.title.toLowerCase() !== 'id');

  return (
    <Space direction="vertical">
      {filteredColumns.map((column) => (
        <Checkbox
          key={column.key}
          checked={visibleColumns.includes(String(column.key))}
          onChange={() => onToggleColumnVisibility(column.key)}
        >
          {column.title}
        </Checkbox>
      ))}
    </Space>
  );
};

export default ColumnVisibilityControl;
