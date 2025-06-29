import { Input } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';
import { Radio } from 'antd';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, TreeSelect, Upload,
} from 'antd';
import { DictDataCreate } from '@/types/dict-data';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const dictDataCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface DictDataCreateProps {
  isDictDataCreateModalVisible: boolean;
  onDictDataCreateCancel: () => void;
  onDictDataCreateFinish: (dictDataCreate: DictDataCreate) => void;
  isDictDataCreateLoading: boolean;
  dictDataCreateForm: FormInstance;
}

const DictDataCreateComponent: React.FC<DictDataCreateProps> = ({
  isDictDataCreateModalVisible,
  onDictDataCreateCancel,
  onDictDataCreateFinish,
  isDictDataCreateLoading,
  dictDataCreateForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onDictDataCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictDataCreateLoading} onClick={() => dictDataCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isDictDataCreateLoading, dictDataCreateForm, onDictDataCreateCancel],
  );

  return (
    <div>
      <Modal
        title="字典数据新增"
        open={isDictDataCreateModalVisible}
        onCancel={onDictDataCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...dictDataCreateFormItemLayout}
          form={ dictDataCreateForm}
          name="dictDataCreate"
          onFinish={onDictDataCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="sort" label="字典排序" rules={[{ required: false, message: '请输入字典排序' }]}>
            <Input placeholder="请输入字典排序" />
          </Form.Item>
          <Form.Item name="label" label="字典标签" rules={[{ required: false, message: '请输入字典标签' }]}>
            <Input placeholder="请输入字典标签" />
          </Form.Item>
          <Form.Item name="value" label="字典键值" rules={[{ required: false, message: '请输入字典键值' }]}>
            <Input placeholder="请输入字典键值" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入字典类型' }]}>
            <Input placeholder="请输入字典类型" disabled={true}/>
          </Form.Item>
          <Form.Item name="echo_style" label="回显样式" rules={[{ required: false, message: '请输入回显样式' }]}>
            <Input placeholder="请输入回显样式" />
          </Form.Item>
          <Form.Item name="ext_class" label="扩展样式" rules={[{ required: false, message: '请输入扩展样式' }]}>
            <Input placeholder="请输入扩展样式" />
          </Form.Item>
          <Form.Item name="is_default" label="是否默认" rules={[{ required: false, message: '请输入是否默认' }]}>
            <Input placeholder="请输入是否默认" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入状态' }]}>
            <Radio>状态</Radio>
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入备注' }]}>
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictDataCreateComponent;
