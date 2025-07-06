'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Avatar, Dropdown, MenuProps, message, Modal } from 'antd';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const iconClass = 'w-4 h-4';

export function UserDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: '确认退出登录',
      content: '确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        logout();
        message.success('已退出登录');
        router.push('/login');
      },
    });
  }, [logout, router]);

  const onClick: MenuProps['onClick'] = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case 'profile':
          router.push('/profile');
          break;
        case 'settings':
          router.push('/settings');
          break;
        case 'logout':
          handleLogout();
          break;
      }
    },
    [handleLogout, router],
  );

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <User className={iconClass} />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut className={iconClass} />,
    },
  ];

  if (!user) return null;

  return (
    <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
      <div className="flex items-center gap-2 cursor-pointer select-none">
        {user.avatar ? (
          <Avatar src={user.avatar} />
        ) : (
          <Avatar icon={<User className={iconClass} />} />
        )}
        <span className="font-medium text-sm text-gray-700">{user.name}</span>
      </div>
    </Dropdown>
  );
}
