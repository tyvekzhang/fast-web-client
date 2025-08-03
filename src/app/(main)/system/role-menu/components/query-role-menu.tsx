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
import { Button, DatePicker, Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface QueryRoleMenuProps {
  onQueryRoleMenuFinish: (values: any) => void;
  onQueryRoleMenuReset: () => void;
  onQueryRoleMenuForm: FormInstance;
}

const queryRoleMenuFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const QueryRoleMenuComponent: React.FC<QueryRoleMenuProps> = ({
  onQueryRoleMenuFinish,
  onQueryRoleMenuReset,
  onQueryRoleMenuForm,
}) => {
  const handleQueryRoleMenuReset = () => {
    onQueryRoleMenuReset();
  };

  const handleQueryRoleMenuSubmit = async () => {
    const values = await onQueryRoleMenuForm.validateFields();
    onQueryRoleMenuFinish(values);
  };
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Form
      {...queryRoleMenuFormItemLayout}
      form={onQueryRoleMenuForm}
      name="queryRoleMenu"
      onFinish={onQueryRoleMenuFinish}
    >
      <div className="flex flex-wrap items-center gap-4 pt-6 justify-between">
        <Form.Item name="id" label="自增编号">
          <Input placeholder="请输入自增编号" allowClear />
        </Form.Item>
        <Form.Item name="create_time" label="创建时间">
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
          <div className="flex items-center gap-2 justify-start pr-4">
            <Button
              onClick={handleQueryRoleMenuReset}
              className="bg-gray-50"
              icon={<RotateCcw size={14} />}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<Search size={14} />}
              onClick={handleQueryRoleMenuSubmit}
            >
              查询
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default QueryRoleMenuComponent;
