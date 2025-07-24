'use client';
import { importTables } from '@/service/code-gen';
import {
  fetchConnections as getConnections,
  fetchDatabases as getDatabases,
  listTables,
} from '@/service/db-manage';
import { Database, DatabaseConnection, TableInfo } from '@/types/db-manage';
import type { TableProps } from 'antd';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface ImportTableProps {
  open: boolean;
  onClose: () => void;
}

const ImportTable: React.FC<ImportTableProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<TableInfo[]>([]);
  const [databaseConnections, setDatabaseConnections] = useState<
    DatabaseConnection[]
  >([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [backend, setBackend] = useState<string>('python');

  // 关闭时重置表单和选中项
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedRowKeys([]);
      setTableData([]);
      setCurrentPage(1);
      setBackend('python');
      setDatabases([]);
    }
  }, [open]);

  // 获取数据库连接配置
  useEffect(() => {
    if (open) {
      getConnections().then(setDatabaseConnections);
    }
  }, [open]);

  // 获取数据库列表
  const handleConnectionChange = async (connectionId: number) => {
    try {
      setLoading(true);
      const response = await getDatabases(connectionId);
      setDatabases(response);
    } finally {
      setLoading(false);
    }
  };

  // 获取表信息
  const getTables = async (values: any, page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const params = {
        ...values,
        current: page,
        page_size: size,
      };
      const response = await listTables(params);
      setTableData(response.records);
      setTotal(response.total_count);
    } finally {
      setLoading(false);
    }
  };

  // 查询
  const handleSearch = async (values: any) => {
    setCurrentPage(1);
    setBackend(values.backend);
    await getTables(form.getFieldsValue(), 1, pageSize);
  };

  // 导入
  const handleImport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导入的表');
      return;
    }
    // 校验必填项
    const values = form.getFieldsValue();
    if (!values.dataSource || !values.database_id || !values.backend) {
      message.warning('请完善表单信息');
      return;
    }
    try {
      setLoading(true);
      const selectedTables = tableData.filter((item) =>
        selectedRowKeys.includes(item.id),
      );
      const tableIds = selectedTables.map((item) => item.id);
      const database_id = selectedTables[0].database_id;
      await importTables(database_id, tableIds, backend);
      message.success('导入成功');
      handleReset();
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    setTableData([]);
    setCurrentPage(1);
    setBackend('python');
    setDatabases([]);
    onClose();
  };

  const columns: TableProps<TableInfo>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '表名称',
      dataIndex: 'name',
    },
    {
      title: '表描述',
      dataIndex: 'comment',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--',
    },
  ];

  const importFormLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <Modal
      title="导入表"
      open={open}
      onCancel={handleReset}
      width={1050}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={handleReset} disabled={loading}>
          取消
        </Button>,
        <Button
          key="import"
          type="primary"
          loading={loading}
          onClick={handleImport}
        >
          导入
        </Button>,
      ]}
    >
      <Form
        {...importFormLayout}
        form={form}
        layout="inline"
        initialValues={{ backend: 'python' }}
        onFinish={handleSearch}
        className={'grid grid-cols-3 gap-y-4'}
      >
        <Form.Item
          name="dataSource"
          label="数据源"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="请选择数据源"
            onChange={handleConnectionChange}
            disabled={loading}
          >
            {databaseConnections.map((config) => (
              <Option key={config.id} value={config.id}>
                {config.connection_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="database_id"
          label="数据库"
          rules={[{ required: true }]}
        >
          <Select placeholder="请选择数据库" disabled={loading}>
            {databases.map((db) => (
              <Option key={db.id} value={db.id}>
                {db.database_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="backend" label="后端" rules={[{ required: true }]}>
          <Select
            placeholder="请选择后端"
            value={backend}
            onChange={setBackend}
            disabled={loading}
          >
            <Option key="python" value="python">
              Python
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="tableName" label="表名称">
          <Input
            placeholder="请输入表名称"
            style={{ width: 128 }}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item name="description" label="表描述">
          <Input
            placeholder="请输入表描述"
            style={{ width: 128 }}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item className={'flex justify-end'}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              搜索
            </Button>
            <Button onClick={handleReset} disabled={loading}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        className={'mt-4'}
        loading={loading}
        columns={columns}
        dataSource={tableData}
        rowKey={'id'}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys as number[]);
          },
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: async (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            await getTables(form.getFieldsValue(), page, size);
          },
        }}
      />
    </Modal>
  );
};

export default ImportTable;
