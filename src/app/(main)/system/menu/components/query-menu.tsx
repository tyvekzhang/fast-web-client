import { Button, DatePicker, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface QueryMenuProps {
  onQueryMenuFinish: (values: any) => void;
  onQueryMenuReset: () => void;
  onQueryMenuForm: FormInstance;
}

const queryMenuFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const QueryMenuComponent: React.FC<QueryMenuProps> = ({
  onQueryMenuFinish,
  onQueryMenuReset,
  onQueryMenuForm,
}) => {
  const handleQueryMenuReset = () => {
    onQueryMenuReset();
    onQueryMenuForm.resetFields();
  };

  const handleQueryMenuSubmit = async () => {
    const values = await onQueryMenuForm.validateFields();

    const { create_time } = values;
    if (create_time?.length === 2) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }

    onQueryMenuFinish(values);
  };

  return (
    <Form
      {...queryMenuFormItemLayout}
      form={onQueryMenuForm}
      name="queryMenu"
      layout="horizontal"
    >
      <div className="flex justify-between flex-wrap pt-4">
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
        <div className="ml-auto">
          <Space>
            <Button
              onClick={handleQueryMenuReset}
              className="bg-gray-50"
              icon={<RotateCcw size={14} />}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<Search size={14} />}
              onClick={handleQueryMenuSubmit}
            >
              查询
            </Button>
          </Space>
        </div>
      </div>
    </Form>
  );
};

export default QueryMenuComponent;
