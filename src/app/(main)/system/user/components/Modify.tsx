"use client"
import { UserModify } from '@/types/user';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface EditProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  handleUserEdit: (values: UserModify) => void;
  isLoading: boolean;
  form: FormInstance;
}
const Modify: React.FC<EditProps> = ({ isModalVisible, handleCancel, handleUserEdit, isLoading, form }) => {
  return (
    <div>
      <Modal
        title="用户编辑"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          <>
            <Button type="primary" htmlType="submit" onClick={() => form.submit()} loading={isLoading}>
              确定
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        }
      >
        <Form form={form} name="user_edit_rule" onFinish={handleUserEdit} {...formItemLayout}>
          <Form.Item name="nickname" label="用户昵称" rules={[{ required: true, message: '必填项' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Modify;
