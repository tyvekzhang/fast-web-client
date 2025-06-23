import type { PermissionAction, PermissionResource, User } from '@/types/auth';

// 权限常量定义
export const PERMISSIONS = {
  // 用户管理权限
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 角色管理权限
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // 仪表盘权限
  DASHBOARD_VIEW: 'dashboard:view',

  // 个人中心权限
  PROFILE_VIEW: 'profile:view',
  PROFILE_UPDATE: 'profile:update',
} as const;

// 权限检查工具函数
export class PermissionChecker {
  private user: User | null;

  constructor(user: User | null) {
    this.user = user;
  }

  // 检查用户是否有特定权限
  hasPermission(permission: string): boolean {
    if (!this.user) return false;

    return this.user.roles.some((role) =>
      role.permissions.some((p) => `${p.resource}:${p.action}` === permission),
    );
  }

  // 检查用户是否有资源的特定操作权限
  hasResourcePermission(
    resource: PermissionResource,
    action: PermissionAction,
  ): boolean {
    return this.hasPermission(`${resource}:${action}`);
  }

  // 检查用户是否有任一权限
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  // 检查用户是否有所有权限
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  // 检查用户是否有特定角色
  hasRole(roleName: string): boolean {
    if (!this.user) return false;
    return this.user.roles.some((role) => role.name === roleName);
  }

  // 获取用户所有权限
  getAllPermissions(): string[] {
    if (!this.user) return [];

    const permissions = new Set<string>();
    this.user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(`${permission.resource}:${permission.action}`);
      });
    });

    return Array.from(permissions);
  }
}

// 创建权限检查器实例
export const createPermissionChecker = (user: User | null) => {
  return new PermissionChecker(user);
};
