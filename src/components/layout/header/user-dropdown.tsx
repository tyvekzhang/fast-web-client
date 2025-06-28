'use client';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { LogOut, Settings, User } from 'lucide-react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Profile',
    icon: <User className="w-4 h-4" />,
  },
  {
    key: '2',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogOut className="w-4 h-4" />,
  },
];

export function UserDropdown() {
  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar icon={<User className="w-4 h-4" />} />
        <span className="font-medium">John Doe</span>
      </div>
    </Dropdown>
  );
}
