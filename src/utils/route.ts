import type { RouteObject } from '@/types/route';

export const searchRoute = (
  path: string,
  routes: RouteObject[],
): RouteObject | null => {
  for (const route of routes) {
    if (route.path === path || route.fullPath === path) {
      return { ...route, fullPath: route.fullPath || route.path };
    }
    if (route.children && route.children.length) {
      const found = searchRoute(path, route.children);
      if (found) return found;
    }
  }
  return null;
};
