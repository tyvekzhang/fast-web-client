'use client';
import ActionButtonComponent from '@/components/base/action-button';
import type { TableProps } from 'antd';
import {
  Button,
  Card,
  Form,
  FormInstance,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { Code2, Edit2, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImportTable from './components/import-table';
import CodePreview from './components/preview-code';
import CodeModify from './components/update-code';

import {
  listTables,
  deleteTable,
  downloadCode,
  syncTable,
} from '@/service/code-gen';
import { TableResponse } from '@/types/code-gen';
import dayjs from 'dayjs';
import { ListTablesRequest } from '@/types/table';

interface LoadingState {
  table: boolean;
  delete: boolean;
  sync: boolean;
  generate: boolean;
  batchDelete: boolean;
  batchGenerate: boolean;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const actionConfig = {
  showCreate: false,
  showImport: true,
  showExport: false,
  showModify: false,
  showRemove: true,
  showEye: false,
  showConfig: false,
  showGenerate: true
};

export default function CodeGen() {
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentTableId, setCurrentTableId] = useState<string>("0");
  const [tableData, setTableData] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    table: false,
    delete: false,
    sync: false,
    generate: false,
    batchDelete: false,
    batchGenerate: false,
  });
  const [pagination, setPagination] = useState({ current: 1, page_size: 10 });

  const columns: TableProps<TableResponse>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'No',
        key: 'No',
        render: (_: number, _record: TableResponse, rowIndex: number) =>
          rowIndex + 1,
        width: '6%',
      },
      {
        title: '连接',
        dataIndex: 'connection_name',
        width: '10%',
      },
      {
        title: '数据库',
        dataIndex: 'database_name',
        width: '15%',
      },
      {
        title: '表名',
        dataIndex: 'table_name',
        width: '10%',
      },
      {
        title: '表描述',
        dataIndex: 'comment',
        render: (text) => text || '--',
        width: '15%',
      },
      {
        title: '数据模型',
        dataIndex: 'entity',
        width: '15%',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        width: '18%',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (record: TableResponse) => (
          <Space size="small">
            <Tooltip title="预览">
              <Button
                type="link"
                size="small"
                icon={<Eye size={14} />}
                onClick={() => {
                  setPreviewOpen(true);
                  setCurrentTableId(record.id);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button
                type="link"
                size="small"
                icon={<Edit2 size={14} />}
                onClick={() => {
                  setEditOpen(true);
                  setCurrentTableId(record.id);
                }}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title="确定要删除吗？"
                onConfirm={() => handleDelete(record)}
              >
                <Button
                  size="small"
                  type="link"
                  icon={<Trash2 size={14} />}
                  loading={loading.delete}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="同步">
              <Button
                size="small"
                type="link"
                icon={<RefreshCw size={14} />}
                loading={loading.sync}
                onClick={() => handleSync(record)}
              />
            </Tooltip>
            <Tooltip title="生成代码">
              <Button
                size="small"
                type="link"
                loading={loading.generate}
                onClick={() => handleCodeGenerate(record)}
                icon={<Code2 size={14} />}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [loading],
  );

  const fetchCodeList = async (params?: ListTablesRequest) => {
    setLoading((prev) => ({ ...prev, table: true }));
    const requestParams = {
      ...params,
      ...(!params?.current && { current: 1 }),
      ...(!params?.page_size && { page_size: 10 }),
    };
    try {
      const res = await listTables(requestParams);
      setTableData(res.records);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const handleSearch = async () => {
    try {
      await fetchCodeList({
        ...form.getFieldsValue(),
        current: 1,
        page_size: pagination.page_size,
      });
      setPagination((prev) => ({ ...prev, current: 1 }));
    } catch (error) {
      message.error('查询失败');
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setPagination({ current: 1, page_size: 10 });
    await fetchCodeList();
  };

  const handleDelete = async (record: TableResponse) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      await deleteTable(record.id);
      message.success('删除成功');
      await fetchCodeList({ ...form.getFieldsValue(), ...pagination });
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的表');
      return;
    }

    setLoading((prev) => ({ ...prev, batchDelete: true }));
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteTable(id)));
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      await fetchCodeList({ ...form.getFieldsValue(), ...pagination });
    } catch (error) {
      message.error('批量删除失败');
    } finally {
      setLoading((prev) => ({ ...prev, batchDelete: false }));
    }
  };

  const handleBatchCodeGenerate = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要生成代码的表');
      return;
    }

    const MAX_BATCH_SIZE = 20;
    if (selectedRowKeys.length > MAX_BATCH_SIZE) {
      message.warning(`一次最多只能生成 ${MAX_BATCH_SIZE} 个表`);
      return;
    }

    setLoading((prev) => ({ ...prev, batchGenerate: true }));
    try {
      await downloadCode(selectedRowKeys, `tables_${dayjs().format('YYYYMMDD')}.zip`);
      message.success(`成功生成 ${selectedRowKeys.length} 个表的代码`);
    } catch (error) {
      message.error('批量生成失败');
    } finally {
      setLoading((prev) => ({ ...prev, batchGenerate: false }));
    }
  };

  const handleSync = async (record: TableResponse) => {
    setLoading((prev) => ({ ...prev, sync: true }));
    try {
      await syncTable(record.id);
      message.success('同步成功');
      await fetchCodeList({ ...form.getFieldsValue(), ...pagination });
    } catch (error) {
      message.error('同步失败');
    } finally {
      setLoading((prev) => ({ ...prev, sync: false }));
    }
  };

  const handleCodeGenerate = async (record: TableResponse) => {
    setLoading((prev) => ({ ...prev, generate: true }));
    try {
      setCurrentTableId(record.id);
      await downloadCode(record.id, `${record.table_name}_code.zip`);
      message.success('生成成功');
    } catch (error) {
      message.error('生成失败');
    } finally {
      setLoading((prev) => ({ ...prev, generate: false }));
    }
  };

  useEffect(() => {
    fetchCodeList();
  }, [importOpen]);

  const rawColumns = useMemo(
    () =>
      columns.map((col, idx) => ({
        key: String(col.key ?? idx),
        title: col.title as string,
      })),
    [columns],
  );

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    rawColumns.map((col) => col.key),
  );

  const onToggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey],
    );
  };

  return (
    <>
      <Card bordered={false}>
        <Form
          form={form}
          onFinish={handleSearch}
          ref={formRef}
        >
          <div className='grid grid-cols-2 px-2'>
            <div className='flex gap-4'>
              <Form.Item name="table_name" label="表名">
                <Input placeholder="请输入表名" />
              </Form.Item>
              <Form.Item name="comment" label="表描述">
                <Input placeholder="请输入表描述" />
              </Form.Item>
            </div>
            <div className='flex justify-end'>
               <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 6 }}
                loading={loading.table}
              >
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Form.Item>
            </div>
          </div>
        </Form>

        <ActionButtonComponent
          onCreate={() => {}}
          onImport={() => setImportOpen(true)}
          onExport={() => {}}
          onBatchModify={() => {}}
          onBatchGenerate={handleBatchCodeGenerate}
          onConfirmBatchRemove={handleBatchDelete}
          onConfirmBatchRemoveCancel={() => {}}
          isQueryShow={true}
          onQueryShow={() => {}}
          isExportDisabled={true}
          isBatchModifyDisabled={true}
          isBatchGenerateDisabled={selectedRowKeys.length === 0}
          isBatchGenerateLoading={loading.batchGenerate}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={loading.batchDelete}
          isExportLoading={false}
          rawColumns={rawColumns}
          visibleColumns={visibleColumns}
          onToggleColumnVisibility={onToggleColumnVisibility}
          className="mb-2 mt-4"
          actionConfig={actionConfig}
        />

        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          loading={loading.table}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedRowKeys(newSelectedRowKeys as string[]);
            },
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.page_size,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, page_size) => {
              setPagination({ current: page, page_size });
              fetchCodeList({
                ...form.getFieldsValue(),
                current: page,
                page_size,
              });
            },
          }}
        />
      </Card>

      <CodePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        tableId={currentTableId}
      />
      {editOpen && (
        <CodeModify
          open={editOpen}
          onClose={() => setEditOpen(false)}
          tableId={currentTableId}
        />
      )}
      <ImportTable open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}