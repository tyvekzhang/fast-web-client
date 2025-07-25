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
  codeList,
  deleteTable,
  downloadCode,
  syncTable,
} from '@/service/code-gen';
import { GenTableQueryResponse } from '@/types/code-gen';
import dayjs from 'dayjs';

interface QueryParams {
  connection?: string;
  db_name?: string;
  table_name?: string;
  table_remark?: string;
  current?: number;
  pageSize?: number;
}

interface LoadingState {
  table: boolean;
  delete: boolean;
  sync: boolean;
  generate: boolean;
  batchDelete: boolean;
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
};

export default function CodeGen() {
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [currentTableId, setCurrentTableId] = useState<number>(0);
  const [tableData, setTableData] = useState<GenTableQueryResponse[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    table: false,
    delete: false,
    sync: false,
    generate: false,
    batchDelete: false,
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns: TableProps<GenTableQueryResponse>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'No',
        key: 'No',
        render: (_: number, _record: GenTableQueryResponse, rowIndex: number) =>
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
        title: '备注',
        dataIndex: 'table_comment',
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
        render: (record: GenTableQueryResponse) => (
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

  // 查询表格数据
  const fetchCodeList = async (params?: QueryParams) => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      const res = await codeList(params);
      setTableData(res.records);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  // 查询表单提交
  const handleSearch = async () => {
    try {
      await fetchCodeList({
        ...form.getFieldsValue(),
        current: 1,
        pageSize: pagination.pageSize,
      });
      setPagination((prev) => ({ ...prev, current: 1 }));
    } catch (error) {
      message.error('查询失败');
    }
  };

  // 查询表单重置
  const handleReset = async () => {
    form.resetFields();
    setPagination({ current: 1, pageSize: 10 });
    await fetchCodeList({ current: 1, pageSize: 10 });
  };

  // 表格分页变化
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    fetchCodeList({
      ...form.getFieldsValue(),
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // 单个删除
  const handleDelete = async (record: GenTableQueryResponse) => {
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

  // 批量删除
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

  // 同步
  const handleSync = async (record: GenTableQueryResponse) => {
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

  // 生成代码
  const handleCodeGenerate = async (record: GenTableQueryResponse) => {
    setLoading((prev) => ({ ...prev, generate: true }));
    try {
      setCurrentTableId(record.id);
      await downloadCode(record.id);
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
          {...formItemLayout}
          onFinish={handleSearch}
          ref={formRef}
        >
          <Space wrap>
            <Form.Item name="connection" label="连接名">
              <Input placeholder="请输入连接名" />
            </Form.Item>
            <Form.Item name="db_name" label="数据库名">
              <Input placeholder="请输入数据库名" />
            </Form.Item>
            <Form.Item name="table_name" label="表名">
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item name="table_remark" label="表描述">
              <Input placeholder="请输入表描述" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
                loading={loading.table}
              >
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Form.Item>
          </Space>
        </Form>

        <ActionButtonComponent
          onCreate={() => {}}
          onImport={() => setImportOpen(true)}
          onExport={() => {}}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleBatchDelete}
          onConfirmBatchRemoveCancel={() => {}}
          isQueryShow={true}
          onQueryShow={() => {}}
          isExportDisabled={true}
          isBatchModifyDisabled={true}
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
              setSelectedRowKeys(newSelectedRowKeys as number[]);
            },
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
              fetchCodeList({
                ...form.getFieldsValue(),
                current: page,
                pageSize,
              });
            },
          }}
          onChange={handleTableChange}
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
