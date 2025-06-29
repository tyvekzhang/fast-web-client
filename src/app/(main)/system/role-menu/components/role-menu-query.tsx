import { Button, DatePicker, Form, Input, Space, Select} from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface RoleMenuQueryProps {
  onRoleMenuQueryFinish: () => void;
  onRoleMenuQueryReset: () => void;
  roleMenuQueryForm: FormInstance;
}

const roleMenuQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const RoleMenuQueryComponent: React.FC<RoleMenuQueryProps> = ({
  onRoleMenuQueryFinish,
  onRoleMenuQueryReset,
  roleMenuQueryForm,
}) => {
  const handleRoleMenuQueryReset = () => {
    onRoleMenuQueryReset();
    onRoleMenuQueryFinish();
  };

  return (
    <Form
      {...roleMenuQueryFormItemLayout}
      form={ roleMenuQueryForm}
      name="roleMenuQuery"
      onFinish={onRoleMenuQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
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
      <Form.Item name="create_time" label="创建时间" rules={[{ required: false, message: '请输入' }]}>
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item name="updater" label="更新者" rules={[{ required: false, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="deleted" label="" rules={[{ required: false, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleRoleMenuQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RoleMenuQueryComponent;