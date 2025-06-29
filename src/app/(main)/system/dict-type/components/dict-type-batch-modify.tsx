import { DictTypeBatchModify } from '@/types/dict-type';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface DictTypeBatchModifyProps {
  isDictTypeBatchModifyModalVisible: boolean;
  onDictTypeBatchModifyCancel: () => void;
  onDictTypeBatchModifyFinish: () => void;
  isDictTypeBatchModifyLoading: boolean;
  dictTypeBatchModifyForm: FormInstance<DictTypeBatchModify>;
}

const dictTypeBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DictTypeBatchModifyComponent: React.FC<DictTypeBatchModifyProps> = ({
  isDictTypeBatchModifyModalVisible,
  onDictTypeBatchModifyCancel,
  onDictTypeBatchModifyFinish,
  isDictTypeBatchModifyLoading,
  dictTypeBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onDictTypeBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictTypeBatchModifyLoading} onClick={onDictTypeBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isDictTypeBatchModifyLoading, onDictTypeBatchModifyCancel],
  );

  return (
    <Modal
      title="字典类型编辑"
      open={isDictTypeBatchModifyModalVisible}
      onCancel={onDictTypeBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... dictTypeBatchModifyFormItemLayout}
          form={ dictTypeBatchModifyForm}
          name="dictTypeBatchModify"
          onFinish={onDictTypeBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="字典名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
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

export default DictTypeBatchModifyComponent;