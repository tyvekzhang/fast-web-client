"use client"
import { UserBatchModify } from '@/types/user';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface BatchModifyProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  handlePasswordVisible: any;
  userBatchModifyForm: FormInstance;
  isUserBatchModifyLoading: boolean;
  handleUserBatchModify: (data: UserBatchModify) => void;
  handleBatchStatusChange: (e: RadioChangeEvent) => void;
  batchStatusValue: number;
  isPasswordVisible: boolean;
}

const BatchModify: React.FC<BatchModifyProps> = ({
  isModalVisible,
  handleCancel,
  userBatchModifyForm,
  isUserBatchModifyLoading,
  handleUserBatchModify,
  handleBatchStatusChange,
  batchStatusValue,
  isPasswordVisible,
  handlePasswordVisible,
}) => {
  return (
    <div>
      <Modal
        title="用户批量编辑"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          <>
            <Button
              type={'primary'}
              htmlType="submit"
              onClick={() => userBatchModifyForm.submit()}
              loading={isUserBatchModifyLoading}
            >
              确定
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        }
      >
        <Form form={userBatchModifyForm} name="user_batch_update_rule" onFinish={handleUserBatchModify}>
          <Form.Item name="status" label="状态" {...formItemLayout}>
            <Radio.Group onChange={handleBatchStatusChange} value={batchStatusValue}>
              <Space>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>禁用</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="password"
            label="密码"
            rules={[
              {
                min: 6,
                message: '请设置密码不少于6位',
              },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: '需要有数字和字母',
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password
              placeholder="请输入"
              visibilityToggle={{ visible: isPasswordVisible, onVisibleChange: handlePasswordVisible }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="remark" label="备注">
            <Input.TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BatchModify;
