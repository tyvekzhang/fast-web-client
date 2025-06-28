'use client';

import { useDictStore } from '@/stores/dict-store';
import { useMenuStore } from '@/stores/menu-store';
import { calculateOpenKeys } from '@/utils/menu-util';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

const LayoutMenu = memo(() => {
  const pathname = usePathname();
  const router = useRouter();

  const { menuList, menuItems, fetchMenus } = useMenuStore();
  const { dictData, fetchDictData } = useDictStore();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

  useEffect(() => {
    const loadData = async () => {
      if (Object.keys(dictData).length === 0) {
        await fetchDictData();
      }
    };
    loadData();
  }, [fetchMenus, fetchDictData, dictData]);

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
    />
  );
});

export default LayoutMenu;
