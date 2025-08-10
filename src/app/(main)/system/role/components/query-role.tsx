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

import { Form, Button } from 'antd';
import { Input } from 'antd';
import { Select, Radio } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { FormInstance } from 'antd/es/form';
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
  const dictData = {
    "key1": "value1",
    "key2": "value2"
}

  return (
    <Form
      {...queryRoleFormItemLayout}
      form={ onQueryRoleForm}
      name="queryRole"
      onFinish={onQueryRoleFinish}
    >
      <div className='flex flex-wrap items-center gap-4 pt-6 justify-between'>
        <Form.Item name="name" label="角色名称" >
          <Input placeholder="请输入角色名称" allowClear />
        </Form.Item>
        <Form.Item name="code" label="角色权限字符串" >
          <Input placeholder="请输入角色权限字符串" allowClear />
        </Form.Item>
        <Form.Item name="create_time" label="创建时间" >
          <DatePicker
            allowClear
            format="YYYY-MM-DD"
            placeholder="请选择创建时间"
            presets={[
              { label: '昨天', value: dayjs().add(-1, 'd') },
              { label: '上周', value: dayjs().add(-7, 'd') },
              { label: '上月', value: dayjs().add(-1, 'month') },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <div className='flex items-center gap-2 justify-start pr-4'>
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