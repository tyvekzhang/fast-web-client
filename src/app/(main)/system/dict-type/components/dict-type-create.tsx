import { Button, Form, Input, Modal, Radio } from 'antd';
import { DictTypeCreate } from '@/types/dict-type';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const dictTypeCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

interface DictTypeCreateProps {
  isDictTypeCreateModalVisible: boolean;
  onDictTypeCreateCancel: () => void;
  onDictTypeCreateFinish: (dictTypeCreate: DictTypeCreate) => void;
  isDictTypeCreateLoading: boolean;
  dictTypeCreateForm: FormInstance;
}

const DictTypeCreateComponent: React.FC<DictTypeCreateProps> = ({
  isDictTypeCreateModalVisible,
  onDictTypeCreateCancel,
  onDictTypeCreateFinish,
  isDictTypeCreateLoading,
  dictTypeCreateForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onDictTypeCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isDictTypeCreateLoading} onClick={() => dictTypeCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isDictTypeCreateLoading, dictTypeCreateForm, onDictTypeCreateCancel],
  );

  return (
    <div>
      <Modal
        title="字典类型新增"
        open={isDictTypeCreateModalVisible}
        onCancel={onDictTypeCreateCancel}
        footer={footerButtons}
      >
        <Form
          {...dictTypeCreateFormItemLayout}
          form={ dictTypeCreateForm}
          name="dictTypeCreate"
          onFinish={onDictTypeCreateFinish}
          className="grid grid-cols-1 gap-y-1 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="字典名称" rules={[{ required: false, message: '请输入字典名称' }]}>
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: false, message: '请输入字典类型' }]}>
            <Input placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入状态' }]}>
            <Radio.Group
              defaultValue={1}
              options={[
                { value: 1, label: "启用" },
                { value: 0, label: "禁用"},
              ]}
            >状态</Radio.Group>
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入备注' }]}>
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictTypeCreateComponent;
