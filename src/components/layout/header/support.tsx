"use client"
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export function Support() {
  return (
    <Button
      type="text"
      icon={<QuestionCircleOutlined />}
      className="flex items-center"
    >
      Support
    </Button>
  );
}
