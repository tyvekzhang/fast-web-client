import { Input } from 'antd';
import { Select } from 'antd';
import { Radio } from 'antd';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, TreeSelect, Upload, Space
} from 'antd';
import { DictTypeModify } from '@/types/dict-type';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface DictTypeModifyProps {
  isDictTypeModifyModalVisible: boolean;
  onDictTypeModifyCancel: () => void;
  onDictTypeModifyFinish: () => void;
  isDictTypeModifyLoading: boolean;
  dictTypeModifyForm: FormInstance<DictTypeModify>;
}

const dictTypeModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictTypeModifyComponent: React.FC<DictTypeModifyProps> = ({
  isDictTypeModifyModalVisible,
  onDictTypeModifyCancel,
  onDictTypeModifyFinish,
  isDictTypeModifyLoading,
  dictTypeModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onDictTypeModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictTypeModifyLoading} onClick={onDictTypeModifyFinish}>
        确定
      </Button>,
    ],
    [isDictTypeModifyLoading, onDictTypeModifyCancel],
  );

  return (
    <Modal
      title="字典类型编辑"
      open={isDictTypeModifyModalVisible}
      onCancel={onDictTypeModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {...dictTypeModifyFormItemLayout}
          form={ dictTypeModifyForm}
          name="dictTypeModify"
          onFinish={onDictTypeModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="字典名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择字典类型" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入' }]}>
            <Radio>状态</Radio>
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default DictTypeModifyComponent;