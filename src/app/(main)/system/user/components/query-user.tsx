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
import { Button, Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface QueryUserProps {
  onQueryUserFinish: (values: any) => void;
  onQueryUserReset: () => void;
  onQueryUserForm: FormInstance;
}

const queryUserFormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 18 },
};

const QueryUserComponent: React.FC<QueryUserProps> = ({
  onQueryUserFinish,
  onQueryUserReset,
  onQueryUserForm,
}) => {
  const handleQueryUserReset = () => {
    onQueryUserReset();
  };

  const handleQueryUserSubmit = async () => {
    const values = await onQueryUserForm.validateFields();
    onQueryUserFinish(values);
  };

  const { dictData } = useDictDataOptions('user_status'.split(','));

  return (
    <Form
      {...queryUserFormItemLayout}
      form={onQueryUserForm}
      name="queryUser"
      onFinish={onQueryUserFinish}
    >
      <div className="flex flex-wrap items-center gap-4 pt-6 justify-between">
        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名" allowClear />
        </Form.Item>
        <Form.Item name="nickname" label="昵称">
          <Input placeholder="请输入昵称" allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            placeholder="请选择状态"
            options={dictData['user_status']}
            className="min-w-30"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex items-center gap-2 justify-start pr-4">
            <Button
              onClick={handleQueryUserReset}
              className="bg-gray-50"
              icon={<RotateCcw size={14} />}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<Search size={14} />}
              onClick={handleQueryUserSubmit}
            >
              查询
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default QueryUserComponent;
