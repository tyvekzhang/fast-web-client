import { UserRoleModify } from '@/types/user-role';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UserRoleModifyProps {
  isUserRoleModifyModalVisible: boolean;
  onUserRoleModifyCancel: () => void;
  onUserRoleModifyFinish: () => void;
  isUserRoleModifyLoading: boolean;
  userRoleModifyForm: FormInstance<UserRoleModify>;
}

const userRoleModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserRoleModifyComponent: React.FC<UserRoleModifyProps> = ({
  isUserRoleModifyModalVisible,
  onUserRoleModifyCancel,
  onUserRoleModifyFinish,
  isUserRoleModifyLoading,
  userRoleModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUserRoleModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isUserRoleModifyLoading} onClick={onUserRoleModifyFinish}>
        确定
      </Button>,
    ],
    [isUserRoleModifyLoading, onUserRoleModifyCancel],
  );

  return (
    <Modal
      title="用户和角色关联编辑"
      open={isUserRoleModifyModalVisible}
      onCancel={onUserRoleModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {...userRoleModifyFormItemLayout}
          form={ userRoleModifyForm}
          name="userRoleModify"
          onFinish={onUserRoleModifyFinish}
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

export default UserRoleModifyComponent;