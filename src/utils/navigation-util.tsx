import { buildSvgIcon } from '@/components/assist/svg-icon';
import { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number];

export interface MenuData {
  name: string;
  path: string;
  icon?: string;
  children?: MenuData[];
}

export interface RouteMeta {
  title?: string;
  affix?: boolean;
  icon?: string;
}

export interface RouteObject {
  path: string;
  fullPath?: string;
  meta?: RouteMeta;
  children?: RouteObject[];
}

export interface RouteData {
  path: string;
  meta: RouteMeta;
}

export const convertToMenuItems = (menus: MenuData[]): MenuItem[] => {
  return menus.map((menu) => ({
    label: menu.name,
    key: menu.path,
    icon: buildSvgIcon(menu.icon, 'sm'),
    children: menu.children ? convertToMenuItems(menu.children) : null,
  }));
};

export const getExpandedMenuPaths = (
  currentPath: string,
  menuItems: MenuData[],
): string[] => {
  if (!currentPath || !menuItems?.length) return [];
  const keys: string[] = [];
  const findParent = (items: MenuData[], target: string): boolean => {
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
  findParent(menuItems, currentPath);
  return keys;
};

export const convertMenusToRoutes = (menus: MenuData[]): RouteData[] => {
  return menus.map((menu) => ({
    path: menu.path,
    meta: {
      title: menu.name,
      icon: menu.icon,
    },
    children: menu.children ? convertMenusToRoutes(menu.children) : undefined,
  }));
};

export const searchRoute = (
  currentPath: string,
  routes: RouteObject[],
): RouteObject | null => {
  for (const route of routes) {
    if (route.path === currentPath || route.fullPath === currentPath) {
      return { ...route, fullPath: route.fullPath || route.path };
    }
    if (route.children && route.children.length) {
      const found = searchRoute(currentPath, route.children);
      if (found) return found;
    }
  }
  return null;
};
