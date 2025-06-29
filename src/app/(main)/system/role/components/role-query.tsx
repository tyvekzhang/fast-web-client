import { Button, DatePicker, Form, Input, Space, Select} from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface RoleQueryProps {
  onRoleQueryFinish: () => void;
  onRoleQueryReset: () => void;
  roleQueryForm: FormInstance;
}

const roleQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const RoleQueryComponent: React.FC<RoleQueryProps> = ({
  onRoleQueryFinish,
  onRoleQueryReset,
  roleQueryForm,
}) => {
  const handleRoleQueryReset = () => {
    onRoleQueryReset();
    onRoleQueryFinish();
  };

  return (
    <Form
      {...roleQueryFormItemLayout}
      form={ roleQueryForm}
      name="roleQuery"
      onFinish={onRoleQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="name" label="角色名称" rules={[{ required: false, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="status" label="角色状态" rules={[{ required: false, message: '请输入' }]}>
        <Select
          allowClear
          placeholder="请选择"
          optionFilterProp="label"
          defaultValue={"1"}
          onChange={() => {} }
          options={[
            {
              value: '1',
              label: '正常',
            },
            {
              value: '0',
              label: '停用',
            },
          ]}
        />
      </Form.Item>
      <Form.Item name="create_time" label="创建时间" rules={[{ required: false, message: '请输入' }]}>
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleRoleQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RoleQueryComponent;
