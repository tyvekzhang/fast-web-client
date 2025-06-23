"use client"
import { Dropdown, Avatar, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Profile',
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Settings',
    icon: <SettingOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogoutOutlined />,
  },
];

export function UserDropdown() {
  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
  <div className="flex items-center gap-2 cursor-pointer">
  <Avatar icon={<UserOutlined />} />
  <span className="font-medium">John Doe</span>
  </div>
  </Dropdown>
);
}
