import type { ServerMenu, MenuItem } from '@/types/menu';
import { buildSvgIcon } from '@/components/svg-icon';

export const convertToMenuItems = (menus: ServerMenu[]): MenuItem[] => {
  return menus.map((menu) => ({
    label: menu.name,
    key: menu.path,
    icon: buildSvgIcon(menu.icon),
    children: menu.children ? convertToMenuItems(menu.children) : [],
  }));
};


export const calculateOpenKeys = (pathname: string, menus: ServerMenu[]): string[] => {
  const keys: string[] = [];
  const findParent = (items: ServerMenu[], target: string): boolean => {
    return items.some((item) => {
      if (item.path === target) return true;
      if (item.children) {
        const found = findParent(item.children, target);
        if (found) keys.push(item.path);
        return found;
      }
      return false;
    });
  };
  findParent(menus, pathname);
  return keys;
};
