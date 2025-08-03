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
import { CreateRole, Role } from '@/types/role';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createRoleFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateRoleProps {
  isCreateRoleModalVisible: boolean;
  onCreateRoleCancel: () => void;
  onCreateRoleFinish: (createRole: CreateRole) => void;
  isCreateRoleLoading: boolean;
  createRoleForm: FormInstance;
  treeSelectDataSource?: Role[];
}

const CreateRoleComponent: React.FC<CreateRoleProps> = ({
  isCreateRoleModalVisible,
  onCreateRoleCancel,
  onCreateRoleFinish,
  isCreateRoleLoading,
  createRoleForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateRoleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateRoleLoading}
        onClick={() => createRoleForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateRoleLoading, createRoleForm, onCreateRoleCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="角色信息新增"
        open={isCreateRoleModalVisible}
        onCancel={onCreateRoleCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createRoleFormItemLayout}
          form={createRoleForm}
          name="createRole"
          onFinish={onCreateRoleFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: false, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色权限字符串"
            rules={[{ required: false, message: '请输入角色权限字符串' }]}
          >
            <Input placeholder="请输入角色权限字符串" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="显示顺序"
            rules={[{ required: false, message: '请输入显示顺序' }]}
          >
            <Input placeholder="请输入显示顺序" />
          </Form.Item>
          <Form.Item
            name="data_scope"
            label="数据范围"
            rules={[{ required: false, message: '请输入数据范围' }]}
          >
            <Input placeholder="请输入数据范围" />
          </Form.Item>
          <Form.Item
            name="data_scope_dept_ids"
            label="数据范围"
            rules={[{ required: false, message: '请输入数据范围' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="角色状态"
            rules={[{ required: false, message: '请输入角色状态' }]}
          >
            <Radio.Group options={['请选择字典生成']} />
          </Form.Item>
          <Form.Item
            name="comment"
            label="备注"
            rules={[{ required: false, message: '请输入备注' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRoleComponent;
