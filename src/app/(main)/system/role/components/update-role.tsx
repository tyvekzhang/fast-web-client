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
import { Role, UpdateRole } from '@/types/role';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Modal, Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UpdateRoleProps {
  isUpdateRoleModalVisible: boolean;
  onUpdateRoleCancel: () => void;
  onUpdateRoleFinish: () => void;
  isUpdateRoleLoading: boolean;
  updateRoleForm: FormInstance<UpdateRole>;
  treeSelectDataSource?: Role[];
}

const updateRoleFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UpdateRoleComponent: React.FC<UpdateRoleProps> = ({
  isUpdateRoleModalVisible,
  onUpdateRoleCancel,
  onUpdateRoleFinish,
  isUpdateRoleLoading,
  updateRoleForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateRoleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateRoleLoading}
        onClick={onUpdateRoleFinish}
      >
        确定
      </Button>,
    ],
    [isUpdateRoleLoading, onUpdateRoleCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="角色信息编辑"
      open={isUpdateRoleModalVisible}
      onCancel={onUpdateRoleCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...updateRoleFormItemLayout}
        form={updateRoleForm}
        name="updateRole"
        onFinish={onUpdateRoleFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      >
        <Form.Item
          name="id"
          label="角色ID"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入角色ID" />
        </Form.Item>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          name="code"
          label="角色权限字符串"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入角色权限字符串" />
        </Form.Item>
        <Form.Item
          name="sort"
          label="显示顺序"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入显示顺序" />
        </Form.Item>
        <Form.Item
          name="data_scope"
          label="数据范围"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入数据范围" />
        </Form.Item>
        <Form.Item
          name="data_scope_dept_ids"
          label="数据范围"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="status"
          label="角色状态"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Radio.Group options={['请选择字典生成']} />
        </Form.Item>
        <Form.Item
          name="comment"
          label="备注"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoleComponent;
