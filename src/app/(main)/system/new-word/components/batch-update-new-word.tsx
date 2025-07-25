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
import { BatchUpdateNewWord, NewWord } from '@/types/new-word';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface BatchUpdateNewWordsProps {
  isBatchUpdateNewWordsModalVisible: boolean;
  onBatchUpdateNewWordsCancel: () => void;
  onBatchUpdateNewWordsFinish: () => void;
  isBatchUpdateNewWordsLoading: boolean;
  batchUpdateNewWordsForm: FormInstance<BatchUpdateNewWord>;
  treeSelectDataSource?: NewWord[];
}

const batchUpdateNewWordsFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const BatchUpdateNewWordsComponent: React.FC<BatchUpdateNewWordsProps> = ({
  isBatchUpdateNewWordsModalVisible,
  onBatchUpdateNewWordsCancel,
  onBatchUpdateNewWordsFinish,
  isBatchUpdateNewWordsLoading,
  batchUpdateNewWordsForm,
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
      <Button key="cancel" onClick={onBatchUpdateNewWordsCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isBatchUpdateNewWordsLoading}
        onClick={onBatchUpdateNewWordsFinish}
      >
        确定
      </Button>,
    ],
    [isBatchUpdateNewWordsLoading, onBatchUpdateNewWordsCancel],
  );
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Modal
      title="[请填写功能名]批量编辑"
      open={isBatchUpdateNewWordsModalVisible}
      onCancel={onBatchUpdateNewWordsCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...batchUpdateNewWordsFormItemLayout}
        form={batchUpdateNewWordsForm}
        name="batchUpdateNewWords"
        onFinish={onBatchUpdateNewWordsFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      ></Form>
    </Modal>
  );
};

export default BatchUpdateNewWordsComponent;
