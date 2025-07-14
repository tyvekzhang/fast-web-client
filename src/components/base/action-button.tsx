import ColumnVisibilityControl from '@/components/base/column-visibility-control';
import { Button, Popconfirm, Popover, Space, Tooltip } from 'antd';
import {
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  Import,
  PenLine,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import React from 'react';

interface ActionButtonsConfig {
  showCreate?: boolean;
  showImport?: boolean;
  showExport?: boolean;
  showModify?: boolean;
  showRemove?: boolean;
}

interface ActionButtonsProps {
  onCreate: () => void;
  onImport: () => void;
  onExport: () => void;
  onBatchModify: () => void;
  onConfirmBatchRemove: () => void;
  onConfirmBatchRemoveCancel: () => void;
  isQueryShow: boolean;
  onQueryShow: () => void;
  isExportDisabled: boolean;
  isBatchModifyDisabled: boolean;
  isBatchRemoveDisabled: boolean;
  isBatchRemoveLoading: boolean;
  isExportLoading: boolean;
  rawColumns: { key: number; title: string }[];
  visibleColumns: string[];
  onToggleColumnVisibility: (columnKey: number) => void;
  className?: string;
  actionConfig?: ActionButtonsConfig;
}

const ActionButtonComponent: React.FC<ActionButtonsProps> = ({
  onCreate,
  onImport,
  onExport,
  onBatchModify,
  onConfirmBatchRemove,
  onConfirmBatchRemoveCancel,
  isQueryShow,
  onQueryShow,
  isExportDisabled,
  isBatchModifyDisabled,
  isBatchRemoveDisabled,
  isBatchRemoveLoading,
  isExportLoading,
  rawColumns,
  visibleColumns,
  onToggleColumnVisibility,
  className = '',
  actionConfig = {},
}) => {
  const defaultConfig = {
    showCreate: true,
    showImport: false,
    showExport: false,
    showModify: false,
    showRemove: true,
  };
  const config = { ...defaultConfig, ...actionConfig };
  return (
    <div className="flex justify-between border-t border-b border-gray-100 pl-2 py-1">
      <Space className={className}>
        {config.showCreate && (
          <Button onClick={onCreate} type="primary" icon={<Plus size={14} />}>
            新增
          </Button>
        )}
        {config.showImport && (
          <Button
            onClick={onImport}
            className="btn-import"
            icon={<Import size={14} />}
          >
            导入
          </Button>
        )}
        {config.showModify && (
          <Button
            disabled={isBatchModifyDisabled}
            onClick={onBatchModify}
            className="btn-batch-update"
            icon={<PenLine size={14} />}
          >
            编辑
          </Button>
        )}

        {config.showExport && (
          <Button
            loading={isExportLoading}
            disabled={isExportDisabled}
            onClick={onExport}
            className="btn-export"
            icon={<Download size={14} />}
          >
            导出
          </Button>
        )}

        {config.showRemove && (
          <Popconfirm
            title="删除所选的内容"
            description="你确定删除吗? 删除后将无法找回"
            onConfirm={onConfirmBatchRemove}
            onCancel={onConfirmBatchRemoveCancel}
            okText="是"
            cancelText="否"
            icon={<HelpCircle className="m-1 text-red-500" size={16} />}
          >
            <Button
              loading={isBatchRemoveLoading}
              disabled={isBatchRemoveDisabled}
              className="btn-batch-delete"
              icon={<Trash2 size={14} />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        )}
      </Space>
      <Space className="pr-2">
        <Tooltip title={isQueryShow ? '隐藏搜索框' : '显示搜索框'}>
          <Button
            className="rounded-full"
            icon={isQueryShow ? <EyeOff size={14} /> : <Eye size={14} />}
            onClick={onQueryShow}
          />
        </Tooltip>
        <Popover
          content={
            <ColumnVisibilityControl
              columns={rawColumns}
              visibleColumns={visibleColumns}
              onToggleColumnVisibility={onToggleColumnVisibility}
            />
          }
          trigger="click"
          placement="bottomRight"
        >
          <Tooltip title="设置列">
            <Button className="rounded-full" icon={<Settings size={14} />} />
          </Tooltip>
        </Popover>
      </Space>
    </div>
  );
};

export default ActionButtonComponent;
