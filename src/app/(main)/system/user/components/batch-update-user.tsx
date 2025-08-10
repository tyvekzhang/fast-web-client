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

import { useDictDataOptions } from '@/service/dict-datum';
import { CheckboxOptionType } from 'antd';
import { Form, Modal, Button } from 'antd';
import { Input } from 'antd';
import { Select, Radio } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { BatchUpdateUser } from '@/types/user';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';


interface BatchUpdateUsersProps {
  isBatchUpdateUsersModalVisible: boolean;
  onBatchUpdateUsersCancel: () => void;
  onBatchUpdateUsersFinish: () => void;
  isBatchUpdateUsersLoading: boolean;
  batchUpdateUsersForm: FormInstance<BatchUpdateUser>;
}

const batchUpdateUsersFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const BatchUpdateUsersComponent: React.FC<BatchUpdateUsersProps> = ({
  isBatchUpdateUsersModalVisible,
  onBatchUpdateUsersCancel,
  onBatchUpdateUsersFinish,
  isBatchUpdateUsersLoading,
  batchUpdateUsersForm,
}) => {
  
  const { dictData } = useDictDataOptions("user_status".split(","))
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onBatchUpdateUsersCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isBatchUpdateUsersLoading} onClick={onBatchUpdateUsersFinish}>
        确定
      </Button>,
    ],
    [isBatchUpdateUsersLoading, onBatchUpdateUsersCancel],
  );

  return (
    <Modal
      title="用户信息批量编辑"
      open={isBatchUpdateUsersModalVisible}
      onCancel={onBatchUpdateUsersCancel}
      footer={footerButtons}
      destroyOnHidden
      width={"60%"}
    >
        <Form
          {...batchUpdateUsersFormItemLayout}
          form={ batchUpdateUsersForm}
          name="batchUpdateUsers"
          onFinish={onBatchUpdateUsersFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="avatar_url" label="头像地址" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入头像地址" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入' }]}>
            <Radio.Group options={ dictData["user_status"] as CheckboxOptionType[] } />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default BatchUpdateUsersComponent;