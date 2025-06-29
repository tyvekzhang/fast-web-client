import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface DictTypeQueryProps {
  onDictTypeQueryFinish: () => void;
  onDictTypeQueryReset: () => void;
  dictTypeQueryForm: FormInstance;
}

const dictTypeQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictTypeQueryComponent: React.FC<DictTypeQueryProps> = ({
                                                                onDictTypeQueryFinish,
                                                                onDictTypeQueryReset,
                                                                dictTypeQueryForm,
                                                              }) => {
  const handleDictTypeQueryReset = () => {
    onDictTypeQueryReset();
    onDictTypeQueryFinish();
  };

  return (
    <Form
      {...dictTypeQueryFormItemLayout}
      form={dictTypeQueryForm}
      name="dictTypeQuery"
      onFinish={onDictTypeQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-0 gap-x-2 pt-4 px-2 border-b"
    >
      <Form.Item name="name" label="字典名称">
        <Input placeholder="请输入字典名称" />
      </Form.Item>
      <Form.Item name="type" label="字典类型">
        <Select placeholder="请选择字典类型" />
      </Form.Item>
      <Form.Item name="status" label="状态">
        <Select placeholder="请选择状态" />
      </Form.Item>
      <Form.Item name="create_time" label="创建时间">
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['请选择开始时间', '请选择结束时间']}
          presets={[
            { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
            { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
            { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
            { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
          ]}
        />
      </Form.Item>
      <div />
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleDictTypeQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DictTypeQueryComponent;
