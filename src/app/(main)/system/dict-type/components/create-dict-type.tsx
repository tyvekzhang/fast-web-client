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
import { CreateDictType, DictType } from '@/types/dict-type';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createDictTypeFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateDictTypeProps {
  isCreateDictTypeModalVisible: boolean;
  onCreateDictTypeCancel: () => void;
  onCreateDictTypeFinish: (createDictType: CreateDictType) => void;
  isCreateDictTypeLoading: boolean;
  createDictTypeForm: FormInstance;
  treeSelectDataSource?: DictType[];
}

const CreateDictTypeComponent: React.FC<CreateDictTypeProps> = ({
  isCreateDictTypeModalVisible,
  onCreateDictTypeCancel,
  onCreateDictTypeFinish,
  isCreateDictTypeLoading,
  createDictTypeForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateDictTypeCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateDictTypeLoading}
        onClick={() => createDictTypeForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateDictTypeLoading, createDictTypeForm, onCreateDictTypeCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="字典类型新增"
        open={isCreateDictTypeModalVisible}
        onCancel={onCreateDictTypeCancel}
        footer={footerButtons}
        width={'50%'}
      >
        <Form
          {...createDictTypeFormItemLayout}
          form={createDictTypeForm}
          name="createDictType"
          onFinish={onCreateDictTypeFinish}
        >
          <Form.Item
            name="name"
            label="字典名称"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="字典类型"
            rules={[{ required: true, message: '请输入字典类型' }]}
          >
            <Input placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item
            name="comment"
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

export default CreateDictTypeComponent;
