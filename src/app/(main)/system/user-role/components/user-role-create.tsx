import { UserRoleCreate } from '@/types/user-role';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const userRoleCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface UserRoleCreateProps {
  isUserRoleCreateModalVisible: boolean;
  onUserRoleCreateCancel: () => void;
  onUserRoleCreateFinish: (UserRoleCreate: UserRoleCreate) => void;
  isUserRoleCreateLoading: boolean;
  userRoleCreateForm: FormInstance;
}

const UserRoleCreateComponent: React.FC<UserRoleCreateProps> = ({
  isUserRoleCreateModalVisible,
  onUserRoleCreateCancel,
  onUserRoleCreateFinish,
  isUserRoleCreateLoading,
  userRoleCreateForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onUserRoleCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isUserRoleCreateLoading} onClick={() => userRoleCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isUserRoleCreateLoading, userRoleCreateForm, onUserRoleCreateCancel],
  );

  return (
    <div>
      <Modal
        title="用户和角色关联新增"
        open={isUserRoleCreateModalVisible}
        onCancel={onUserRoleCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...userRoleCreateFormItemLayout}
          form={ userRoleCreateForm}
          name="userRoleCreate"
          onFinish={onUserRoleCreateFinish}
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
    </div>
  );
};

export default UserRoleCreateComponent;