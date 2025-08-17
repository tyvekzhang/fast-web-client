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

import { Button, DatePicker, Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface QueryRoleProps {
  onQueryRoleFinish: (values: any) => void;
  onQueryRoleReset: () => void;
  onQueryRoleForm: FormInstance;
}

const queryRoleFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const QueryRoleComponent: React.FC<QueryRoleProps> = ({
  onQueryRoleFinish,
  onQueryRoleReset,
  onQueryRoleForm,
}) => {
  const handleQueryRoleReset = () => {
    onQueryRoleReset();
  };

  const handleQueryRoleSubmit = async () => {
    const values = await onQueryRoleForm.validateFields();
    onQueryRoleFinish(values);
  };

  return (
    <Form
      {...queryRoleFormItemLayout}
      form={onQueryRoleForm}
      name="queryRole"
      onFinish={onQueryRoleFinish}
    >
      <div className="flex flex-wrap items-center gap-4 pt-6 justify-between">
        <Form.Item name="name" label="角色名称">
          <Input placeholder="请输入角色名称" allowClear />
        </Form.Item>
        <Form.Item name="code" label="权限标识">
          <Input placeholder="请输入权限标识" allowClear />
        </Form.Item>
        <Form.Item name="create_time" label="创建时间">
          <DatePicker.RangePicker
            allowClear
            format="YYYY-MM-DD"
            placeholder={['请选择开始时间', '请选择结束时间']}
            presets={[
              { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
              { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
              { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
              { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <div className="flex items-center gap-2 justify-start pr-4">
            <Button
              onClick={handleQueryRoleReset}
              className="bg-gray-50"
              icon={<RotateCcw size={14} />}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<Search size={14} />}
              onClick={handleQueryRoleSubmit}
            >
              查询
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default QueryRoleComponent;
