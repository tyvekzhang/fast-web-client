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
import { BatchUpdateDictDatum, DictDatum } from '@/types/dict-datum';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface BatchUpdateDictDataProps {
  isBatchUpdateDictDataModalVisible: boolean;
  onBatchUpdateDictDataCancel: () => void;
  onBatchUpdateDictDataFinish: () => void;
  isBatchUpdateDictDataLoading: boolean;
  batchUpdateDictDataForm: FormInstance<BatchUpdateDictDatum>;
  treeSelectDataSource?: DictDatum[];
}

const batchUpdateDictDataFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const BatchUpdateDictDataComponent: React.FC<BatchUpdateDictDataProps> = ({
  isBatchUpdateDictDataModalVisible,
  onBatchUpdateDictDataCancel,
  onBatchUpdateDictDataFinish,
  isBatchUpdateDictDataLoading,
  batchUpdateDictDataForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [
    { name: '根目录', id: 0, children: treeSelectDataSource },
  ];
  const treeSelectData = TreeSelectUtil.convert(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onBatchUpdateDictDataCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isBatchUpdateDictDataLoading}
        onClick={onBatchUpdateDictDataFinish}
      >
        确定
      </Button>,
    ],
    [isBatchUpdateDictDataLoading, onBatchUpdateDictDataCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="字典数据批量编辑"
      open={isBatchUpdateDictDataModalVisible}
      onCancel={onBatchUpdateDictDataCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...batchUpdateDictDataFormItemLayout}
        form={batchUpdateDictDataForm}
        name="batchUpdateDictData"
        onFinish={onBatchUpdateDictDataFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      >
        <Form.Item
          name="sort"
          label="字典排序"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入字典排序" />
        </Form.Item>
        <Form.Item
          name="label"
          label="字典标签"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入字典标签" />
        </Form.Item>
        <Form.Item
          name="value"
          label="字典键值"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入字典键值" />
        </Form.Item>
        <Form.Item
          name="type"
          label="字典类型"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Select placeholder="请选择字典类型" />
        </Form.Item>
        <Form.Item
          name="echo_style"
          label="回显样式"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入回显样式" />
        </Form.Item>
        <Form.Item
          name="ext_class"
          label="扩展样式"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入扩展样式" />
        </Form.Item>
        <Form.Item
          name="is_default"
          label="是否默认"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入是否默认" />
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

export default BatchUpdateDictDataComponent;
