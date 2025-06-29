import { Button, DatePicker, Form, Input, Space} from 'antd';
import { FormInstance } from 'antd/es/form';
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
    const { create_time } = values
    if (create_time) {
      const [startDate, endDate] = create_time
      values.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    onMenuQueryFinish()
  };

  return (
    <Form
      {...menuQueryFormItemLayout}
      form={ menuQueryForm}
      name="menuQuery"
      onFinish={handleMenuQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="name" label="名称" rules={[{ required: false, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="create_time" label="创建时间" rules={[{ required: false, message: '请输入' }]}>
        <DatePicker.RangePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleMenuQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MenuQueryComponent;
