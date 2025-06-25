'use client';

import { memo, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { useMenuStore } from '@/stores/menu-store';
import { useDictStore } from '@/stores/dict-store';
import { calculateOpenKeys } from '@/utils/menu-util';

const LayoutMenu = memo(() => {
  const pathname = usePathname();
  const router = useRouter();

  // Zustand 状态管理
  const {
    menuList,
    menuItems,
    loading,
    fetchMenus,
  } = useMenuStore();
  const { dictData, fetchDictData } = useDictStore();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

  // 初始化加载菜单和字典
  useEffect(() => {
    const loadData = async () => {
      if (Object.keys(dictData).length === 0) {
        await fetchDictData();
      }
    };
    loadData();
  }, [fetchMenus, fetchDictData, dictData]);

  // 监听路由变化，更新菜单选中项与展开项
  useEffect(() => {
    setSelectedKeys([pathname]);
    if (menuItems.length > 0) {
      setOpenKeys(calculateOpenKeys(pathname, menuList));
    }
  }, [pathname, menuItems]);

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestKey ? [latestKey] : []);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    router.push(key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      items={menuItems}
      onClick={handleMenuClick}
      onOpenChange={handleOpenChange}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
});

export default LayoutMenu;
