// Copyright (c) 2025 FastWeb and/or its affiliates. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.import { Input } from 'antd';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import React from 'react';

interface TableQueryProps {
  onTableQueryFinish: () => void;
  onTableQueryReset: () => void;
  tableQueryForm: FormInstance;
}

const tableQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TableQueryComponent: React.FC<TableQueryProps> = ({
  onTableQueryFinish,
  onTableQueryReset,
  tableQueryForm,
}) => {
  const handleTableQueryReset = () => {
    onTableQueryReset();
    onTableQueryFinish();
  };
  const dictData = {
    "key1": "value1",
    "key2": "value2"
}

  return (
    <Form
      {...tableQueryFormItemLayout}
      form={ tableQueryForm}
      name="tableQuery"
      onFinish={onTableQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="id" label="id" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="table_name" label="table_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="sub_table_name" label="sub_table_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="sub_table_fk_name" label="sub_table_fk_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="class_name" label="class_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="backend" label="backend" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="tpl_category" label="tpl_category" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="tpl_web_type" label="tpl_web_type" >
        <Select placeholder="请选择" allowClear />
      </Form.Item>
      <Form.Item name="tpl_backend_type" label="tpl_backend_type" >
        <Select placeholder="请选择" allowClear />
      </Form.Item>
      <Form.Item name="package_name" label="package_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="module_name" label="module_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="business_name" label="business_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="function_name" label="function_name" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="function_author" label="function_author" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="gen_type" label="gen_type" >
        <Select placeholder="请选择" allowClear />
      </Form.Item>
      <Form.Item name="gen_path" label="gen_path" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="options" label="options" >
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="create_time" label="create_time" >
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择"
          presets={[
            { label: '昨天', value: dayjs().add(-1, 'd') },
            { label: '上周', value: dayjs().add(-7, 'd') },
            { label: '上月', value: dayjs().add(-1, 'month') },
          ]}
        />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleTableQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TableQueryComponent;