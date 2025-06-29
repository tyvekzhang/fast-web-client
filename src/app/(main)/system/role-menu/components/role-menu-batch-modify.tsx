import { RoleMenuBatchModify } from '@/types/role-menu';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface RoleMenuBatchModifyProps {
  isRoleMenuBatchModifyModalVisible: boolean;
  onRoleMenuBatchModifyCancel: () => void;
  onRoleMenuBatchModifyFinish: () => void;
  isRoleMenuBatchModifyLoading: boolean;
  roleMenuBatchModifyForm: FormInstance<RoleMenuBatchModify>;
}

const roleMenuBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const RoleMenuBatchModifyComponent: React.FC<RoleMenuBatchModifyProps> = ({
  isRoleMenuBatchModifyModalVisible,
  onRoleMenuBatchModifyCancel,
  onRoleMenuBatchModifyFinish,
  isRoleMenuBatchModifyLoading,
  roleMenuBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onRoleMenuBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isRoleMenuBatchModifyLoading} onClick={onRoleMenuBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isRoleMenuBatchModifyLoading, onRoleMenuBatchModifyCancel],
  );

  return (
    <Modal
      title="角色和菜单关联编辑"
      open={isRoleMenuBatchModifyModalVisible}
      onCancel={onRoleMenuBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... roleMenuBatchModifyFormItemLayout}
          form={ roleMenuBatchModifyForm}
          name="roleMenuBatchModify"
          onFinish={onRoleMenuBatchModifyFinish}
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
  );
};

export default RoleMenuBatchModifyComponent;