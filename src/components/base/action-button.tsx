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
  RotateCcw,
  Settings,
  Trash2,
} from 'lucide-react';
import React from 'react';

interface ActionButtonsConfig {
  showCreate?: boolean;
  createText?: string;
  showImport?: boolean;
  importText?: string;
  showExport?: boolean;
  exportText?: string;
  showModify?: boolean;
  modifyText?: string;
  showRemove?: boolean;
  removeText?: string;
  showEye?: boolean;
  showConfig?: boolean;
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
  rawColumns: { key: string; title: string }[];
  visibleColumns: string[];
  onToggleColumnVisibility: (columnKey: string) => void;
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
    createText: '新增',
    showImport: false,
    importText: '导入',
    showExport: false,
    exportText: '导出',
    showModify: false,
    modifyText: '编辑',
    showRemove: true,
    removeText: '删除',
    showEye: true,
    showConfig: true,
  };
  const config = { ...defaultConfig, ...actionConfig };

  return (
    <div className="flex justify-between border-t border-b border-gray-100 pl-2 py-1">
      <Space className={className}>
        {config.showCreate && (
          <Button onClick={onCreate} type="primary" icon={<Plus size={14} />}>
            {config.createText}
          </Button>
        )}
        {config.showImport && (
          <Button
            onClick={onImport}
            className="btn-import"
            icon={<Import size={14} />}
          >
            {config.importText}
          </Button>
        )}
        {config.showModify && (
          <Button
            disabled={isBatchModifyDisabled}
            onClick={onBatchModify}
            className="btn-batch-update"
            icon={<PenLine size={14} />}
          >
            {config.modifyText}
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
            {config.exportText}
          </Button>
        )}
        {config.showRemove && (
          <Popconfirm
            title="删除所选的内容"
            description="确定删除吗? 删除后将无法找回"
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
              {config.removeText}
            </Button>
          </Popconfirm>
        )}
      </Space>
      <Space className="pr-2">
        {config.showEye && (
          <Tooltip title={isQueryShow ? '隐藏搜索框' : '显示搜索框'}>
            <Button
              className="rounded-full"
              icon={isQueryShow ? <EyeOff size={14} /> : <Eye size={14} />}
              onClick={onQueryShow}
            />
          </Tooltip>
        )}

        <Tooltip title="刷新页面">
          <Button
            className="rounded-full"
            icon={<RotateCcw size={14} />}
            onClick={() => window.location.reload()}
          />
        </Tooltip>
        {config.showConfig && (
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
        )}
      </Space>
    </div>
  );
};

export default ActionButtonComponent;
