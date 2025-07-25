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
import { CreateNewWord, NewWord } from '@/types/new-word';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createNewWordFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateNewWordProps {
  isCreateNewWordModalVisible: boolean;
  onCreateNewWordCancel: () => void;
  onCreateNewWordFinish: (createNewWord: CreateNewWord) => void;
  isCreateNewWordLoading: boolean;
  createNewWordForm: FormInstance;
  treeSelectDataSource?: NewWord[];
}

const CreateNewWordComponent: React.FC<CreateNewWordProps> = ({
  isCreateNewWordModalVisible,
  onCreateNewWordCancel,
  onCreateNewWordFinish,
  isCreateNewWordLoading,
  createNewWordForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.transform(
    treeSelectDataTransform as any,
  );
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateNewWordCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateNewWordLoading}
        onClick={() => createNewWordForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateNewWordLoading, createNewWordForm, onCreateNewWordCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="[请填写功能名]新增"
        open={isCreateNewWordModalVisible}
        onCancel={onCreateNewWordCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createNewWordFormItemLayout}
          form={createNewWordForm}
          name="createNewWord"
          onFinish={onCreateNewWordFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="word"
            label="word"
            rules={[{ required: false, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="translation"
            label="translation"
            rules={[{ required: false, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="next_review_date"
            label="next_review_date"
            rules={[{ required: false, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="tenant"
            label="tenant"
            rules={[{ required: false, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateNewWordComponent;
