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
import { CreateDictDatum, DictDatum } from '@/types/dict-datum';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const createDictDatumFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateDictDatumProps {
  isCreateDictDatumModalVisible: boolean;
  onCreateDictDatumCancel: () => void;
  onCreateDictDatumFinish: (createDictDatum: CreateDictDatum) => void;
  isCreateDictDatumLoading: boolean;
  createDictDatumForm: FormInstance;
  treeSelectDataSource?: DictDatum[];
}

const CreateDictDatumComponent: React.FC<CreateDictDatumProps> = ({
  isCreateDictDatumModalVisible,
  onCreateDictDatumCancel,
  onCreateDictDatumFinish,
  isCreateDictDatumLoading,
  createDictDatumForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateDictDatumCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateDictDatumLoading}
        onClick={() => createDictDatumForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateDictDatumLoading, createDictDatumForm, onCreateDictDatumCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <div>
      <Modal
        title="字典数据新增"
        open={isCreateDictDatumModalVisible}
        onCancel={onCreateDictDatumCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...createDictDatumFormItemLayout}
          form={createDictDatumForm}
          name="createDictDatum"
          onFinish={onCreateDictDatumFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item
            name="type"
            label="字典类型"
            rules={[{ required: false, message: '请输入字典类型' }]}
          >
            <Select placeholder="请选择字典类型" disabled />
          </Form.Item>
          <Form.Item
            name="value"
            label="字典键"
            rules={[{ required: true, message: '请输入字典键' }]}
          >
            <Input placeholder="请输入字典键" />
          </Form.Item>
          <Form.Item
            name="label"
            label="字典标签"
            rules={[{ required: true, message: '请输入字典标签' }]}
          >
            <Input placeholder="请输入字典标签" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="字典排序"
            rules={[{ required: false, message: '请输入字典排序' }]}
          >
            <Input placeholder="请输入字典排序" />
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

export default CreateDictDatumComponent;
