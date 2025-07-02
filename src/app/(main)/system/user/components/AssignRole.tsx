'use client';
import { RolePage } from '@/types/role';
import type { UserRoleAssign } from '@/types/user';
import { Button, Form, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type React from 'react';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

interface AssignRoleProps {
  isAssignRoleModalVisible: boolean;
  handleAssignRoleCancel: () => void;
  handleAssignRole: (values: { roles: UserRoleAssign[] }) => void;
  isAssignRoleLoading: boolean;
  assignRoleForm: FormInstance;
  availableRoles: RolePage[];
}

const AssignRole: React.FC<AssignRoleProps> = ({
  isAssignRoleModalVisible,
  handleAssignRoleCancel,
  handleAssignRole,
  isAssignRoleLoading,
  assignRoleForm,
  availableRoles,
}) => {
  return (
    <Modal
      title="分配角色"
      open={isAssignRoleModalVisible}
      onCancel={handleAssignRoleCancel}
      footer={null}
    >
      <Form
        form={assignRoleForm}
        name="assign_role_form"
        onFinish={handleAssignRole}
        {...formItemLayout}
      >
        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '请选择至少一个角色' }]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            optionFilterProp="label"
          >
            {availableRoles.map((role) => (
              <Select.Option key={role.id} value={role.id} label={role.name}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isAssignRoleLoading}
          >
            确定
          </Button>
          <Button onClick={handleAssignRoleCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignRole;
