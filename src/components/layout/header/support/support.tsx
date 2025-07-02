'use client';
import { Button, Tooltip } from 'antd';
import { HelpCircle } from 'lucide-react';

export function Support() {
  return (
    <Tooltip title="Help">
      <Button type="text" icon={<HelpCircle />} shape="circle" />
    </Tooltip>
  );
}
