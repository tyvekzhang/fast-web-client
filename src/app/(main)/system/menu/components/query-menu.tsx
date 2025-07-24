import { Button, DatePicker, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface MenuQueryProps {
  onMenuQueryFinish: (values: any) => void;
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
    menuQueryForm.resetFields();
  };

  const handleMenuQuerySubmit = async () => {
    try {
      const values = await menuQueryForm.validateFields();

      // 格式化 create_time
      const { create_time } = values;
      if (create_time?.length === 2) {
        const [startDate, endDate] = create_time;
        values.create_time = [
          startDate.format('YYYY-MM-DD'),
          endDate.format('YYYY-MM-DD'),
        ];
      }

      onMenuQueryFinish(values);
    } catch (error) {
      // validateFields 失败时自动提示，无需额外处理
    }
  };

  return (
    <div className="flex justify-between">
      <Form
        {...menuQueryFormItemLayout}
        form={menuQueryForm}
        name="menuQuery"
        layout="horizontal"
        className="flex flex-wrap gap-y-0 gap-x-4 pt-4"
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: false, message: '请输入名称' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          name="create_time"
          label="创建时间"
          rules={[{ required: false, message: '请选择时间' }]}
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
        <Button
          type="primary"
          icon={<Search size={14} />}
          onClick={handleMenuQuerySubmit}
        >
          查询
        </Button>
      </Space>
    </div>
  );
};

export default MenuQueryComponent;
