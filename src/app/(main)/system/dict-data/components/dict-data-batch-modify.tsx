import { DictDataBatchModify } from '@/types/dict-data';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface DictDataBatchModifyProps {
  isDictDataBatchModifyModalVisible: boolean;
  onDictDataBatchModifyCancel: () => void;
  onDictDataBatchModifyFinish: () => void;
  isDictDataBatchModifyLoading: boolean;
  dictDataBatchModifyForm: FormInstance<DictDataBatchModify>;
}

const dictDataBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictDataBatchModifyComponent: React.FC<DictDataBatchModifyProps> = ({
  isDictDataBatchModifyModalVisible,
  onDictDataBatchModifyCancel,
  onDictDataBatchModifyFinish,
  isDictDataBatchModifyLoading,
  dictDataBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onDictDataBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictDataBatchModifyLoading} onClick={onDictDataBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isDictDataBatchModifyLoading, onDictDataBatchModifyCancel],
  );

  return (
    <Modal
      title="字典数据编辑"
      open={isDictDataBatchModifyModalVisible}
      onCancel={onDictDataBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... dictDataBatchModifyFormItemLayout}
          form={ dictDataBatchModifyForm}
          name="dictDataBatchModify"
          onFinish={onDictDataBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="sort" label="字典排序" rules={[{ required: false, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="label" label="字典标签" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="value" label="字典键值" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="echo_style" label="回显样式" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="ext_class" label="扩展样式" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="is_default" label="是否默认" rules={[{ required: false, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入' }]}>
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
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default DictDataBatchModifyComponent;