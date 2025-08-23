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
import { Button, Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface QueryDictDatumProps {
  onQueryDictDatumFinish: (values: any) => void;
  onQueryDictDatumReset: () => void;
  onQueryDictDatumForm: FormInstance;
}

const queryDictDatumFormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 18 },
};

const QueryDictDatumComponent: React.FC<QueryDictDatumProps> = ({
  onQueryDictDatumFinish,
  onQueryDictDatumReset,
  onQueryDictDatumForm,
}) => {
  const handleQueryDictDatumReset = () => {
    onQueryDictDatumReset();
  };

  const handleQueryDictDatumSubmit = async () => {
    const values = await onQueryDictDatumForm.validateFields();
    onQueryDictDatumFinish(values);
  };

  return (
    <Form
      {...queryDictDatumFormItemLayout}
      form={onQueryDictDatumForm}
      name="queryDictDatum"
      onFinish={onQueryDictDatumFinish}
    >
      <div className="flex flex-wrap items-center gap-2 pt-6 justify-between">
        <Form.Item name="type" label="字典名">
          <Input placeholder="请输入字典名" />
        </Form.Item>
        <Form.Item name="label" label="字典标签">
          <Input placeholder="请输入字典标签" allowClear />
        </Form.Item>
        <Form.Item name="value" label="字典键名">
          <Input placeholder="请输入字典键值" allowClear />
        </Form.Item>
        <Form.Item>
          <div className="flex items-center gap-2 justify-start pr-4">
            <Button
              onClick={handleQueryDictDatumReset}
              className="bg-gray-50"
              icon={<RotateCcw size={14} />}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<Search size={14} />}
              onClick={handleQueryDictDatumSubmit}
            >
              查询
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default QueryDictDatumComponent;
