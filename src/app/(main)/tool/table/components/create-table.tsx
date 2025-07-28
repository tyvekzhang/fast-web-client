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
import { CreateTable, Table } from '@/types/table';
import { TreeSelectUtil } from '@/utils/select-util';
import {
  Button, Form, Input,
  Modal, Select
} from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createTableFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateTableProps {
  isCreateTableModalVisible: boolean;
  onCreateTableCancel: () => void;
  onCreateTableFinish: (createTable: CreateTable) => void;
  isCreateTableLoading: boolean;
  createTableForm: FormInstance;
  treeSelectDataSource?: Table[];
}

const CreateTableComponent: React.FC<CreateTableProps> = ({
  isCreateTableModalVisible,
  onCreateTableCancel,
  onCreateTableFinish,
  isCreateTableLoading,
  createTableForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [{ name: '根目录', id: 0, children: treeSelectDataSource }];
  const treeSelectData = TreeSelectUtil.transform(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateTableCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isCreateTableLoading} onClick={() => createTableForm.submit()}>
        确定
      </Button>,
    ],
    [isCreateTableLoading, createTableForm, onCreateTableCancel],
  );
  const dictData = {
    "key1": "value1",
    "key2": "value2"
  }

  return (
    <div>
      <Modal
        title="[请填写功能名]新增"
        open={isCreateTableModalVisible}
        onCancel={onCreateTableCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createTableFormItemLayout}
          form={ createTableForm}
          name="createTable"
          onFinish={onCreateTableFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="database_id" label="database_id" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="db_table_id" label="db_table_id" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="table_name" label="table_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="sub_table_name" label="sub_table_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="sub_table_fk_name" label="sub_table_fk_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="class_name" label="class_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="backend" label="backend" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="tpl_category" label="tpl_category" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="tpl_web_type" label="tpl_web_type" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择" />
          </Form.Item>
          <Form.Item name="tpl_backend_type" label="tpl_backend_type" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择" />
          </Form.Item>
          <Form.Item name="package_name" label="package_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="module_name" label="module_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="business_name" label="business_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="function_name" label="function_name" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="function_author" label="function_author" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="gen_type" label="gen_type" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择" />
          </Form.Item>
          <Form.Item name="gen_path" label="gen_path" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="options" label="options" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="comment" label="comment" rules={[{ required: false, message: '请输入' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateTableComponent;