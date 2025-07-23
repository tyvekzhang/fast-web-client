"use client"
import { importTables } from '@/service/code-gen';
import { fetchConnections as getConnections, fetchDatabases as getDatabases, listTables } from '@/service/db-manage';
import { Database, DatabaseConnection, TableInfo } from '@/types/db-manage';
import type { TableProps } from 'antd';
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd';
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
  const [databaseConnections, setDatabaseConnections] = useState<DatabaseConnection[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

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
  const getTables = async (values: any) => {
    try {
      setLoading(true);
      const params = {
        ...values,
        current: currentPage,
        page_size: pageSize,
      };
      const response = await listTables(params);
      setTableData(response.records);
      setTotal(response.total_count);
    } finally {
      setLoading(false);
    }
  };

  const [backend, setBackend] = useState<string>("python")
  const handleSearch = async (values: any) => {
    setCurrentPage(1);
    setBackend(values.backend)
    await getTables(form.getFieldsValue());
  };

  const handleImport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导入的表');
      return;
    }
    try {
      setLoading(true);
      const selectedTables = tableData.filter((item) => selectedRowKeys.includes(item.id));
      const tableIds = selectedTables.map((item) => item.id);
      const database_id = selectedTables[0].database_id;
      await importTables(database_id, tableIds, backend);
      handleReset();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    setTableData([]);
    setCurrentPage(1);
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
      render: (text) => (text ? text : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
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
        <Button key="cancel" onClick={handleReset}>
          取消
        </Button>,
        <Button key="import" type="primary" loading={loading} onClick={handleImport}>
          导入
        </Button>,
      ]}
    >
      <Form {...importFormLayout} form={form} layout="inline" initialValues={{ backend: "java" }} onFinish={handleSearch} className={"grid grid-cols-3 gap-y-4"}>
        <Form.Item name="dataSource" label="数据源" rules={[{ required: true }]}>
          <Select placeholder="请选择数据源" onChange={handleConnectionChange}>
            {databaseConnections.map((config) => (
              <Option key={config.id} value={config.id}>
                {config.connection_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="database_id" label="数据库" rules={[{ required: true }]}>
          <Select placeholder="请选择数据库" >
            {databases.map((db) => (
              <Option key={db.id} value={db.id}>
                {db.database_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="backend" label="后端">
          <Select placeholder="请选择后端" onClick={() => setBackend}>
            <Option key="java" value="java">Java</Option>
            <Option key="python" value="python">Python</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tableName" label="表名称">
          <Input placeholder="请输入表名称" style={{ width: 128 }} />
        </Form.Item>
        <Form.Item name="description" label="表描述">
          <Input placeholder="请输入表描述" style={{ width: 128 }} />
        </Form.Item>
        <Form.Item className={"flex justify-end"}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        className={"mt-4"}
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
            setLoading(true);
            const params = {
              ...form.getFieldsValue(),
              currentPage: currentPage,
              pageSize,
            };
            const response = await listTables(params);
            setTableData(response.records);
            setTotal(response.total_count);
          },
        }}
      />
    </Modal>
  );
};

export default ImportTable;
