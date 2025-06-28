import httpClient from '@/lib/http';
import type { MenuRecord } from '@/types/menu';

export function getMenus() {
  return httpClient.get<MenuRecord[]>('/v1/user/menus');
}
