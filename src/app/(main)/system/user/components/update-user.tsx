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
import { UpdateUser, User } from '@/types/user';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UpdateUserProps {
  isUpdateUserModalVisible: boolean;
  onUpdateUserCancel: () => void;
  onUpdateUserFinish: () => void;
  isUpdateUserLoading: boolean;
  updateUserForm: FormInstance<UpdateUser>;
  treeSelectDataSource?: User[];
}

const updateUserFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UpdateUserComponent: React.FC<UpdateUserProps> = ({
  isUpdateUserModalVisible,
  onUpdateUserCancel,
  onUpdateUserFinish,
  isUpdateUserLoading,
  updateUserForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateUserCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateUserLoading}
        onClick={onUpdateUserFinish}
      >
        确定
      </Button>,
    ],
    [isUpdateUserLoading, onUpdateUserCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="用户信息编辑"
      open={isUpdateUserModalVisible}
      onCancel={onUpdateUserCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...updateUserFormItemLayout}
        form={updateUserForm}
        name="updateUser"
        onFinish={onUpdateUserFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      >
        <Form.Item
          name="id"
          label="主键"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入主键" />
        </Form.Item>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          name="avatar_url"
          label="头像地址"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入头像地址" />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Radio.Group options={['请选择字典生成']} />
        </Form.Item>
        <Form.Item
          name="remark"
          label="备注"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserComponent;
