import { Button, DatePicker, Form, Input, Space, Select} from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface UserRoleQueryProps {
  onUserRoleQueryFinish: () => void;
  onUserRoleQueryReset: () => void;
  userRoleQueryForm: FormInstance;
}

const userRoleQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserRoleQueryComponent: React.FC<UserRoleQueryProps> = ({
  onUserRoleQueryFinish,
  onUserRoleQueryReset,
  userRoleQueryForm,
}) => {
  const handleUserRoleQueryReset = () => {
    onUserRoleQueryReset();
    onUserRoleQueryFinish();
  };

  return (
    <Form
      {...userRoleQueryFormItemLayout}
      form={ userRoleQueryForm}
      name="userRoleQuery"
      onFinish={onUserRoleQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="role_id" label="角色ID" rules={[{ required: false, message: '请输入' }]}>
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
          <Button onClick={handleUserRoleQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserRoleQueryComponent;