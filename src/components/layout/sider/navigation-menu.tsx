'use client';

import { useDictStore } from '@/stores/dict-store';
import { useMenuStore } from '@/stores/menu-store';
import { getExpandedMenuPaths } from '@/utils/navigation-util';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

const LayoutMenu = memo(() => {
  const pathname = usePathname();
  const router = useRouter();

  const { menuList, menuItems, setMenuList } = useMenuStore();
  const { dictData, fetchDictData } = useDictStore();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

  useEffect(() => {
    const loadData = async () => {
      setMenuList();
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (
        dictData === undefined ||
        dictData === null ||
        Object.keys(dictData).length === 0
      ) {
        await fetchDictData();
      }
    };
    loadData();
  }, [setMenuList, fetchDictData, dictData]);

  useEffect(() => {
    setSelectedKeys([pathname]);
    if (menuItems.length > 0) {
      setOpenKeys(getExpandedMenuPaths(pathname, menuList));
    }
  }, [pathname, menuItems]);

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestKey ? [latestKey] : []);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '/chat') {
      window.open(key, '_blank');
    } else {
      router.push(key);
    }
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
