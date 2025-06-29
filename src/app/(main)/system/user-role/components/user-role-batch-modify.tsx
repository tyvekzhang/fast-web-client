import { UserRoleBatchModify } from '@/types/user-role';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UserRoleBatchModifyProps {
  isUserRoleBatchModifyModalVisible: boolean;
  onUserRoleBatchModifyCancel: () => void;
  onUserRoleBatchModifyFinish: () => void;
  isUserRoleBatchModifyLoading: boolean;
  userRoleBatchModifyForm: FormInstance<UserRoleBatchModify>;
}

const userRoleBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserRoleBatchModifyComponent: React.FC<UserRoleBatchModifyProps> = ({
  isUserRoleBatchModifyModalVisible,
  onUserRoleBatchModifyCancel,
  onUserRoleBatchModifyFinish,
  isUserRoleBatchModifyLoading,
  userRoleBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUserRoleBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isUserRoleBatchModifyLoading} onClick={onUserRoleBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isUserRoleBatchModifyLoading, onUserRoleBatchModifyCancel],
  );

  return (
    <Modal
      title="用户和角色关联编辑"
      open={isUserRoleBatchModifyModalVisible}
      onCancel={onUserRoleBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... userRoleBatchModifyFormItemLayout}
          form={ userRoleBatchModifyForm}
          name="userRoleBatchModify"
          onFinish={onUserRoleBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="role_id" label="角色ID" rules={[{ required: false, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="creator" label="创建者" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="updater" label="更新者" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="deleted" label="" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default UserRoleBatchModifyComponent;