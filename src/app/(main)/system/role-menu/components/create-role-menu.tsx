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
import { CreateRoleMenu, RoleMenu } from '@/types/role-menu';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createRoleMenuFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateRoleMenuProps {
  isCreateRoleMenuModalVisible: boolean;
  onCreateRoleMenuCancel: () => void;
  onCreateRoleMenuFinish: (createRoleMenu: CreateRoleMenu) => void;
  isCreateRoleMenuLoading: boolean;
  createRoleMenuForm: FormInstance;
  treeSelectDataSource?: RoleMenu[];
}

const CreateRoleMenuComponent: React.FC<CreateRoleMenuProps> = ({
  isCreateRoleMenuModalVisible,
  onCreateRoleMenuCancel,
  onCreateRoleMenuFinish,
  isCreateRoleMenuLoading,
  createRoleMenuForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateRoleMenuCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateRoleMenuLoading}
        onClick={() => createRoleMenuForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateRoleMenuLoading, createRoleMenuForm, onCreateRoleMenuCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="角色和菜单关联新增"
        open={isCreateRoleMenuModalVisible}
        onCancel={onCreateRoleMenuCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createRoleMenuFormItemLayout}
          form={createRoleMenuForm}
          name="createRoleMenu"
          onFinish={onCreateRoleMenuFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="role_id"
            label="角色ID"
            rules={[{ required: false, message: '请输入角色ID' }]}
          >
            <Input placeholder="请输入角色ID" />
          </Form.Item>
          <Form.Item
            name="menu_id"
            label="菜单ID"
            rules={[{ required: false, message: '请输入菜单ID' }]}
          >
            <Input placeholder="请输入菜单ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRoleMenuComponent;
