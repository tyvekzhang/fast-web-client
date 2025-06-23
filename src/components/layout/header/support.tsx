'use client';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

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
