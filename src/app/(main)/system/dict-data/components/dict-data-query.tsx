import { Button, Form, Input, Select, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import { DictTypePage } from '@/types/dict-type';
import { fetchDictTypeByPage } from '@/service/dict-type';

interface DictDataQueryProps {
  onDictDataQueryFinish: () => void;
  onDictDataQueryReset: () => void;
  onDictTypeChange: (value: string) => void;
  dictDataQueryForm: FormInstance;
}

const dictDataQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictDataQueryComponent: React.FC<DictDataQueryProps> = ({
                                                                onDictDataQueryFinish,
                                                                onDictDataQueryReset,
                                                                onDictTypeChange,
                                                                dictDataQueryForm,
                                                              }) => {
  const handleDictDataQueryReset = () => {
    onDictDataQueryReset();
    onDictDataQueryFinish();
  };

  const queryParams = new URLSearchParams(window.location.search);
  const [dictTypePageDataSource, setDictTypePageDataSource] = useState<DictTypePage[]>([]);
  const [dictType, setDictType] = useState(queryParams.get('type'));
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetchDictTypeByPage();
      setDictTypePageDataSource(resp.records);
    };
    fetchData().then(() => {
      if (dictType !== null) {
        dictDataQueryForm.setFieldsValue({ type: dictType });
      }
    });
  }, [dictType]);

  return (
    <Form
      {...dictDataQueryFormItemLayout}
      form={dictDataQueryForm}
      name="dictDataQuery"
      onFinish={onDictDataQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="type" label="字典名称">
        <Select
          placeholder="请选择字典名称"
          onChange={onDictTypeChange}
          options={dictTypePageDataSource.map(item => ({
            value: item.type,
            label: item.name  ,
          }))}
        />
      </Form.Item>
      <Form.Item name="label" label="字典标签">
        <Input placeholder="请输入字典标签" />
      </Form.Item>
      <Form.Item name="status" label="状态">
        <Select placeholder="请选择状态" />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleDictDataQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DictDataQueryComponent;
