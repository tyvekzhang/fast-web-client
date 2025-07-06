import { useMenuStore } from '@/stores/menu-store';
import { MenuRecord } from '@/types/menu';

/**
 * 将路由配置转换为菜单配置
 * @param routes 路由配置数组
 * @returns 菜单配置数组
 */
export const convertRoutesToMenus = (routes: RouteObject[]): MenuRecord[] => {
  return routes.map((route) => ({
    name: route.meta.title,
    path: route.path,
    icon: route.meta.icon,
  }));
};

/**
 * 获取动态路由配置
 * @description 从菜单store中获取路由配置并转换为标准格式
 * @returns 路由配置数组
 */
export const getDynamicRoutes = (): RouteObject[] => {
  const menuStore = useMenuStore();

  // 确保store已初始化，可以添加错误处理
  if (!menuStore.menuList) {
    console.warn('菜单数据未初始化，返回空数组');
    return [];
  }

  return convertRoutesToMenus(menuStore.menuList);
};

/**
 * 获取菜单配置
 * @description 直接返回转换后的菜单配置
 * @returns 菜单配置数组
 */
export const getMenuList = (): MenuRecord[] => {
  return convertRoutesToMenus(getDynamicRoutes());
};
