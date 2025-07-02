'use client';
import { UserAdd } from '@/types/user';
import { Button, Form, Input, Modal, Progress, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const formPropItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface AddProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  handleUserAdd: (data: UserAdd) => void;
  isLoading: boolean;
  formProp: FormInstance;
}

const Add: React.FC<AddProps> = ({
  isModalVisible,
  handleCancel,
  handleUserAdd,
  isLoading,
  formProp,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={handleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isLoading}
        onClick={() => formProp.submit()}
      >
        确定
      </Button>,
    ],
    [isLoading],
  );

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ level: 0, text: '' });

  const checkPasswordStrength = useCallback((password: string) => {
    const lengthCriteria = password.length >= 8;
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;

    if (lengthCriteria) score++;
    if (upperCaseCriteria) score++;
    if (lowerCaseCriteria) score++;
    if (numberCriteria) score++;
    if (specialCharCriteria) score++;

    switch (score) {
      case 0:
      case 1:
        setStrength({ level: 1, text: '弱' });
        break;
      case 2:
      case 3:
        setStrength({ level: 2, text: '中等' });
        break;
      case 4:
        setStrength({ level: 3, text: '强' });
        break;
      default:
        setStrength({ level: 0, text: '' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
    formProp.setFieldsValue({ password: newPassword });
  };

  const restField = () => {
    formProp.resetFields();
    setStrength({ level: 0, text: '' });
    setPassword('');
  };

  const onFinish = (data: UserAdd) => {
    handleUserAdd(data);
    restField();
  };

  useEffect(() => {
    restField();
    setPassword('');
  }, [isModalVisible]);

  return (
    <div>
      <Modal
        title="用户新增"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={footerButtons}
      >
        <Form
          {...formPropItemLayout}
          form={formProp}
          name="userAdd"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '必填项' }]}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                min: 6,
                message: '请设置密码不少于6位',
              },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: '需要有数字和字母',
              },
            ]}
            tooltip="密码至少6位，包括大小写字母、数字"
          >
            <Input.Password
              placeholder="请输入"
              onChange={handleChange}
              value={password}
            />
            <div>
              <Space>
                <Progress
                  percent={(strength.level / 3) * 100}
                  steps={3}
                  showInfo={false}
                  strokeColor={
                    strength.level === 0
                      ? 'red'
                      : strength.level === 1
                        ? '#ff7875'
                        : strength.level === 2
                          ? '#ffa940'
                          : '#52c41a'
                  }
                  status={strength.level === 3 ? 'success' : 'active'}
                  strokeLinecap="round"
                />
                <div
                  style={{
                    textAlign: 'right',
                    color: strength.level === 3 ? '#52c41a' : '#000',
                  }}
                >
                  {strength.text}
                </div>
              </Space>
            </div>
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '必填项' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Add;
