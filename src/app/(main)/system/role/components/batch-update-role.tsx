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
import { Form, Modal, Button } from 'antd';
import { Input } from 'antd';
import { Select, Radio } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { BatchUpdateRole } from '@/types/role';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';


interface BatchUpdateRolesProps {
  isBatchUpdateRolesModalVisible: boolean;
  onBatchUpdateRolesCancel: () => void;
  onBatchUpdateRolesFinish: () => void;
  isBatchUpdateRolesLoading: boolean;
  batchUpdateRolesForm: FormInstance<BatchUpdateRole>;
}

const batchUpdateRolesFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const BatchUpdateRolesComponent: React.FC<BatchUpdateRolesProps> = ({
  isBatchUpdateRolesModalVisible,
  onBatchUpdateRolesCancel,
  onBatchUpdateRolesFinish,
  isBatchUpdateRolesLoading,
  batchUpdateRolesForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onBatchUpdateRolesCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isBatchUpdateRolesLoading} onClick={onBatchUpdateRolesFinish}>
        确定
      </Button>,
    ],
    [isBatchUpdateRolesLoading, onBatchUpdateRolesCancel],
  );
  const dictData = {
    "key1": "value1",
    "key2": "value2"
}

  return (
    <Modal
      title="角色信息批量编辑"
      open={isBatchUpdateRolesModalVisible}
      onCancel={onBatchUpdateRolesCancel}
      footer={footerButtons}
      destroyOnHidden
      width={"60%"}
    >
        <Form
          {...batchUpdateRolesFormItemLayout}
          form={ batchUpdateRolesForm}
          name="batchUpdateRoles"
          onFinish={onBatchUpdateRolesFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="角色名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色权限字符串" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入角色权限字符串" />
          </Form.Item>
          <Form.Item name="sort" label="显示顺序" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入显示顺序" />
          </Form.Item>
          <Form.Item name="operation_type" label="操作类型" rules={[{ required: false, message: '请输入' }]}>
            <Select
                placeholder="请选择操作类型"
                options={ dictData["operation_type"] }
            />
          </Form.Item>
          <Form.Item name="data_scope" label="数据范围" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入数据范围" />
          </Form.Item>
          <Form.Item name="data_scope_dept_ids" label="数据范围" rules={[{ required: false, message: '请输入' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="角色状态" rules={[{ required: false, message: '请输入' }]}>
            <Radio.Group options={ dictData["role_status"] as CheckboxOptionType[] } />
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default BatchUpdateRolesComponent;