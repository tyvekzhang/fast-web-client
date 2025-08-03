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
import { DictType, UpdateDictType } from '@/types/dict-type';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UpdateDictTypeProps {
  isUpdateDictTypeModalVisible: boolean;
  onUpdateDictTypeCancel: () => void;
  onUpdateDictTypeFinish: () => void;
  isUpdateDictTypeLoading: boolean;
  updateDictTypeForm: FormInstance<UpdateDictType>;
  treeSelectDataSource?: DictType[];
}

const updateDictTypeFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UpdateDictTypeComponent: React.FC<UpdateDictTypeProps> = ({
  isUpdateDictTypeModalVisible,
  onUpdateDictTypeCancel,
  onUpdateDictTypeFinish,
  isUpdateDictTypeLoading,
  updateDictTypeForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateDictTypeCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateDictTypeLoading}
        onClick={onUpdateDictTypeFinish}
      >
        确定
      </Button>,
    ],
    [isUpdateDictTypeLoading, onUpdateDictTypeCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="字典类型编辑"
      open={isUpdateDictTypeModalVisible}
      onCancel={onUpdateDictTypeCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...updateDictTypeFormItemLayout}
        form={updateDictTypeForm}
        name="updateDictType"
        onFinish={onUpdateDictTypeFinish}
      >
        <Form.Item
          name="name"
          label="字典名称"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item
          name="type"
          label="字典类型"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入字典类型" />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Radio.Group options={['请选择字典生成']} />
        </Form.Item>
        <Form.Item
          name="comment"
          label="备注"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDictTypeComponent;
