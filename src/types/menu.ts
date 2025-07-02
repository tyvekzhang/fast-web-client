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

export interface MenuPage {
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

export interface MenuCreate {
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

export interface MenuQuery {
  /** 名称 */
  name: string;

  /** 创建时间 */
  create_time: string[];
}

export interface MenuModify {
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

export interface MenuBatchModify {
  /** 主键列表 */
  ids: string[];

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

export interface MenuDetail {
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

  /** 创建时间 */
  create_time: string;

  /** 备注信息 */
  comment: string;
}
