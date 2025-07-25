import type { MenuProps } from 'antd';
import { PaginationRequest } from '.';

export interface MenuRecord {
  name: string;
  path: string;
  icon?: string;
  children?: MenuRecord[];
}

export type MenuItem = Required<MenuProps>['items'][number];

export interface AppMenu {
  name: string;
  path: string;
  children?: AppMenu[];
  disabled?: boolean;
  icon?: string;
  affix?: boolean;
  orderNo?: number;
  visible?: number;
  hideChildrenInMenu?: boolean;
  hideBreadcrumb?: boolean;
}

export interface ListMenusRequest extends PaginationRequest {
  /** 名称 */
  name: string;

  /** 创建时间 */
  create_time: string[];
}

export interface Menu {
  /** 主键 */
  id: string;

  /** 名称 */
  name: string;

  /** 图标 */
  icon: string;

  /** 权限标识 */
  permission: string;

  /** 排序 */
  sort: number;

  /** 路由地址 */
  path: string;

  /** 组件路径 */
  component: string;

  /** 状态（1正常 0停用） */
  status: number;

  /** 创建时间 */
  create_time: string;
}

export interface MenuDetail extends Menu {}

export interface CreateMenu {
  /** 名称 */
  name: string;

  /** 图标 */
  icon: string;

  /** 权限标识 */
  permission: string;

  /** 排序 */
  sort: number;

  /** 路由地址 */
  path: string;

  /** 组件路径 */
  component: string;

  /** 类型（1目录 2菜单 3按钮） */
  type: number;

  /** 是否缓存（1缓存 0不缓存） */
  cacheable: number;

  /** 是否显示（1显示 0隐藏） */
  visible: number;

  /** 父ID */
  parent_id: string;

  /** 状态（1正常 0停用） */
  status: number;

  /** 备注信息 */
  comment: string;
}

export interface CreateMenuRequest {
  menu: CreateMenu;
}

export interface UpdateMenu {
  /** 主键 */
  id: string;

  /** 名称 */
  name: string;

  /** 图标 */
  icon: string;

  /** 权限标识 */
  permission: string;

  /** 排序 */
  sort: number;

  /** 路由地址 */
  path: string;

  /** 组件路径 */
  component: string;

  /** 类型（1目录 2菜单 3按钮） */
  type: number;

  /** 是否缓存（1缓存 0不缓存） */
  cacheable: number;

  /** 是否显示（1显示 0隐藏） */
  visible: number;

  /** 父ID */
  parent_id: string;

  /** 状态（1正常 0停用） */
  status: number;

  /** 备注信息 */
  comment: string;
}

export interface UpdateMenuRequest {
  menu: UpdateMenu;
}

export interface BatchGetMenusResponse {
  menus: MenuDetail[];
}

export interface BatchCreateMenusRequest {
  menus: CreateMenu[];
}

export interface BatchCreateMenuResponse {
  menus: Menu[];
}

export interface BatchUpdateMenu {
  /** 排序 */
  sort: number;
  /** 类型（1目录 2菜单 3按钮） */
  type: number;
}

export interface BatchUpdateMenusRequest {
  ids: string[];
  menu: BatchUpdateMenu;
}

export interface BatchPatchMenusRequest {
  menus: UpdateMenu[];
}

export interface BatchUpdateMenusResponse {
  menus: Menu[];
}

export interface BatchDeleteMenusRequest {
  ids: string[];
}

export interface ExportMenu extends Menu {}

export interface ExportMenusRequest {
  ids: string[];
}

export interface ImportMenusRequest {
  file: File;
}

export interface ImportMenu extends CreateMenu {
  errMsg: string;
}

export interface ImportMenusResponse {
  menus: ImportMenu[];
}
