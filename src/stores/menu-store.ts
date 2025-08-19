import { getMenus } from '@/service/menu-service';
import type { MenuItem, MenuRecord } from '@/types/menu';
import { convertToMenuItems, RouteObject } from '@/utils/navigation-util';
import { create } from 'zustand';

interface MenuState {
  menuList: MenuRecord[];
  menuItems: MenuItem[];
  loading: boolean;
  setMenuList: () => Promise<void>;
  getRoutes: () => RouteObject[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menuList: [],
  menuItems: [],
  loading: false,
  setMenuList: async () => {
    set({ loading: true });
    try {
      const menus = await getMenus();
      set({
        menuList: menus,
        menuItems: convertToMenuItems(menus),
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      set({ loading: false });
    }
  },
  getRoutes: (): RouteObject[] => {
    const menuList = get().menuList;
    const convert = (menus: MenuRecord[]): RouteObject[] =>
      menus.map((menu) => ({
        path: menu.path,
        meta: {
          title: menu.name,
          affix: menu.path === '/home' && true,
          icon: menu.icon,
        },

        children: menu.children ? convert(menu.children) : undefined,
      }));

    return convert(menuList);
  },
}));
