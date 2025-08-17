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
// limitations under the License.

import { useDictDataOptions } from '@/service/dict-datum';
import { CreateUser } from '@/types/user';
import { Button, CheckboxOptionType, Form, Input, Modal, Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createUserFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateUserProps {
  isCreateUserModalVisible: boolean;
  onCreateUserCancel: () => void;
  onCreateUserFinish: (createUser: CreateUser) => void;
  isCreateUserLoading: boolean;
  createUserForm: FormInstance;
}

const CreateUserComponent: React.FC<CreateUserProps> = ({
  isCreateUserModalVisible,
  onCreateUserCancel,
  onCreateUserFinish,
  isCreateUserLoading,
  createUserForm,
}) => {
  const { dictData } = useDictDataOptions('user_status'.split(','));
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateUserCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateUserLoading}
        onClick={() => createUserForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateUserLoading, createUserForm, onCreateUserCancel],
  );

  return (
    <div>
      <Modal
        title="用户信息新增"
        open={isCreateUserModalVisible}
        onCancel={onCreateUserCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createUserFormItemLayout}
          initialValues={{ status: '1' }}
          form={createUserForm}
          name="createUser"
          onFinish={onCreateUserFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: false, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: false, message: '请输入密码' }]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: false, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="avatar_url"
            label="头像地址"
            rules={[{ required: false, message: '请输入头像地址' }]}
          >
            <Input placeholder="请输入头像地址" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: false, message: '请输入状态' }]}
          >
            <Radio.Group
              options={dictData['user_status'] as CheckboxOptionType[]}
            />
          </Form.Item>
          <Form.Item
            name="remark"
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

export default CreateUserComponent;
