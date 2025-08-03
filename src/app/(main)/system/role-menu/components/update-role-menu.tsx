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
import { RoleMenu, UpdateRoleMenu } from '@/types/role-menu';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UpdateRoleMenuProps {
  isUpdateRoleMenuModalVisible: boolean;
  onUpdateRoleMenuCancel: () => void;
  onUpdateRoleMenuFinish: () => void;
  isUpdateRoleMenuLoading: boolean;
  updateRoleMenuForm: FormInstance<UpdateRoleMenu>;
  treeSelectDataSource?: RoleMenu[];
}

const updateRoleMenuFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UpdateRoleMenuComponent: React.FC<UpdateRoleMenuProps> = ({
  isUpdateRoleMenuModalVisible,
  onUpdateRoleMenuCancel,
  onUpdateRoleMenuFinish,
  isUpdateRoleMenuLoading,
  updateRoleMenuForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateRoleMenuCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateRoleMenuLoading}
        onClick={onUpdateRoleMenuFinish}
      >
        确定
      </Button>,
    ],
    [isUpdateRoleMenuLoading, onUpdateRoleMenuCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="角色和菜单关联编辑"
      open={isUpdateRoleMenuModalVisible}
      onCancel={onUpdateRoleMenuCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...updateRoleMenuFormItemLayout}
        form={updateRoleMenuForm}
        name="updateRoleMenu"
        onFinish={onUpdateRoleMenuFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      >
        <Form.Item
          name="id"
          label="自增编号"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入自增编号" />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="角色ID"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入角色ID" />
        </Form.Item>
        <Form.Item
          name="menu_id"
          label="菜单ID"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入菜单ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoleMenuComponent;
