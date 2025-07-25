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
import { Button, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface NewWordQueryProps {
  onNewWordQueryFinish: () => void;
  onNewWordQueryReset: () => void;
  newWordQueryForm: FormInstance;
}

const newWordQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const NewWordQueryComponent: React.FC<NewWordQueryProps> = ({
  onNewWordQueryFinish,
  onNewWordQueryReset,
  newWordQueryForm,
}) => {
  const handleNewWordQueryReset = () => {
    onNewWordQueryReset();
    onNewWordQueryFinish();
  };
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Form
      {...newWordQueryFormItemLayout}
      form={newWordQueryForm}
      name="newWordQuery"
      onFinish={onNewWordQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="id" label="id">
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="word" label="word">
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="translation" label="translation">
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="next_review_date" label="next_review_date">
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name="tenant" label="tenant">
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleNewWordQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NewWordQueryComponent;
