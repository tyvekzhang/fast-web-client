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
import { DictDataModify } from '@/types/dict-data';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface DictDataModifyProps {
  isDictDataModifyModalVisible: boolean;
  onDictDataModifyCancel: () => void;
  onDictDataModifyFinish: () => void;
  isDictDataModifyLoading: boolean;
  dictDataModifyForm: FormInstance<DictDataModify>;
}

const dictDataModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictDataModifyComponent: React.FC<DictDataModifyProps> = ({
  isDictDataModifyModalVisible,
  onDictDataModifyCancel,
  onDictDataModifyFinish,
  isDictDataModifyLoading,
  dictDataModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onDictDataModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictDataModifyLoading} onClick={onDictDataModifyFinish}>
        确定
      </Button>,
    ],
    [isDictDataModifyLoading, onDictDataModifyCancel],
  );

  return (
    <Modal
      title="字典数据编辑"
      open={isDictDataModifyModalVisible}
      onCancel={onDictDataModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {...dictDataModifyFormItemLayout}
          form={ dictDataModifyForm}
          name="dictDataModify"
          onFinish={onDictDataModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="sort" label="字典排序" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入字典排序" />
          </Form.Item>
          <Form.Item name="label" label="字典标签" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入字典标签" />
          </Form.Item>
          <Form.Item name="value" label="字典键值" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入字典键值" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择字典类型" />
          </Form.Item>
          <Form.Item name="echo_style" label="回显样式" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入回显样式" />
          </Form.Item>
          <Form.Item name="ext_class" label="扩展样式" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入扩展样式" />
          </Form.Item>
          <Form.Item name="is_default" label="是否默认" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入是否默认" />
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

export default DictDataModifyComponent;