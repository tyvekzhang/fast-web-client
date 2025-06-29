import { RoleMenuCreate } from '@/types/role-menu';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const roleMenuCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface RoleMenuCreateProps {
  isRoleMenuCreateModalVisible: boolean;
  onRoleMenuCreateCancel: () => void;
  onRoleMenuCreateFinish: (RoleMenuCreate: RoleMenuCreate) => void;
  isRoleMenuCreateLoading: boolean;
  roleMenuCreateForm: FormInstance;
}

const RoleMenuCreateComponent: React.FC<RoleMenuCreateProps> = ({
  isRoleMenuCreateModalVisible,
  onRoleMenuCreateCancel,
  onRoleMenuCreateFinish,
  isRoleMenuCreateLoading,
  roleMenuCreateForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onRoleMenuCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isRoleMenuCreateLoading} onClick={() => roleMenuCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isRoleMenuCreateLoading, roleMenuCreateForm, onRoleMenuCreateCancel],
  );

  return (
    <div>
      <Modal
        title="角色和菜单关联新增"
        open={isRoleMenuCreateModalVisible}
        onCancel={onRoleMenuCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...roleMenuCreateFormItemLayout}
          form={ roleMenuCreateForm}
          name="roleMenuCreate"
          onFinish={onRoleMenuCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="role_id" label="角色ID" rules={[{ required: false, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="menu_id" label="菜单ID" rules={[{ required: false, message: '请输入' }]}>
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

export default RoleMenuCreateComponent;