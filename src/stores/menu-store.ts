import { create } from 'zustand';
import { getMenus } from '@/service/menu-service';
import type { ServerMenu, MenuItem } from '@/types/menu';
import { convertToMenuItems } from '@/utils/menu-util';

interface MenuState {
  menuList: ServerMenu[];
  menuItems: MenuItem[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuList: [],
  menuItems: [],
  loading: false,
  fetchMenus: async () => {
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
}));
