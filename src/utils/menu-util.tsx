import { buildSvgIcon } from '@/components/svg-icon';
import type { MenuItem, MenuRecord } from '@/types/menu';

export const convertToMenuItems = (menus: MenuRecord[]): MenuItem[] => {
  return menus.map((menu) => ({
    label: menu.name,
    key: menu.path,
    icon: buildSvgIcon(menu.icon, "sm"),
    children: menu.children ? convertToMenuItems(menu.children) : null,
  }));
};

export const calculateOpenKeys = (
  pathname: string,
  menus: MenuRecord[],
): string[] => {
  const keys: string[] = [];
  const findParent = (items: MenuRecord[], target: string): boolean => {
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
