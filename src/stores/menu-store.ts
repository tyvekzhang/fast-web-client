import { getMenus } from '@/service/menu-service';
import type { MenuItem, MenuRecord } from '@/types/menu';
import { convertToMenuItems } from '@/utils/menu-util';
import { create } from 'zustand';

interface MenuState {
  menuList: MenuRecord[];
  menuItems: MenuItem[];
  loading: boolean;
  setMenuList: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuList: [],
  menuItems: [],
  loading: false,
  setMenuList: async () => {
    set({ loading: true });
    try {
      const menus = await getMenus();
      debugger
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
}));
