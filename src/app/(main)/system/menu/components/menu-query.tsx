import { Button, DatePicker, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface MenuQueryProps {
  onMenuQueryFinish: () => void;
  onMenuQueryReset: () => void;
  menuQueryForm: FormInstance;
}

const menuQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MenuQueryComponent: React.FC<MenuQueryProps> = ({
  onMenuQueryFinish,
  onMenuQueryReset,
  menuQueryForm,
}) => {
  const handleMenuQueryReset = () => {
    onMenuQueryReset();
    onMenuQueryFinish();
  };

  const handleMenuQueryFinish = (values: any) => {
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    onMenuQueryFinish();
  };

  return (
    <div className="flex justify-between">
      <Form
        {...menuQueryFormItemLayout}
        form={menuQueryForm}
        name="menuQuery"
        onFinish={handleMenuQueryFinish}
        layout="horizontal"
        className="flex gap-y-0 gap-x-4 pt-4 "
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="create_time"
          label="创建时间"
          rules={[{ required: false, message: '请输入' }]}
        >
          <DatePicker.RangePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
      <Space className="inline-flex">
        <Button
          onClick={handleMenuQueryReset}
          className="bg-gray-50"
          icon={<RotateCcw size={14} />}
        >
          重置
        </Button>
        <Button type="primary" htmlType="submit" icon={<Search size={14} />}>
          查询
        </Button>
      </Space>
    </div>
  );
};

export default MenuQueryComponent;
