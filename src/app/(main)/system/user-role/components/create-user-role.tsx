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
import { CreateUserRole, UserRole } from '@/types/user-role';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createUserRoleFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateUserRoleProps {
  isCreateUserRoleModalVisible: boolean;
  onCreateUserRoleCancel: () => void;
  onCreateUserRoleFinish: (createUserRole: CreateUserRole) => void;
  isCreateUserRoleLoading: boolean;
  createUserRoleForm: FormInstance;
  treeSelectDataSource?: UserRole[];
}

const CreateUserRoleComponent: React.FC<CreateUserRoleProps> = ({
  isCreateUserRoleModalVisible,
  onCreateUserRoleCancel,
  onCreateUserRoleFinish,
  isCreateUserRoleLoading,
  createUserRoleForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateUserRoleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateUserRoleLoading}
        onClick={() => createUserRoleForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateUserRoleLoading, createUserRoleForm, onCreateUserRoleCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="用户和角色关联新增"
        open={isCreateUserRoleModalVisible}
        onCancel={onCreateUserRoleCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createUserRoleFormItemLayout}
          form={createUserRoleForm}
          name="createUserRole"
          onFinish={onCreateUserRoleFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="role_id"
            label="角色ID"
            rules={[{ required: false, message: '请输入角色ID' }]}
          >
            <Input placeholder="请输入角色ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserRoleComponent;
