import type { LoginCredentials, User } from '@/types/auth';

// 模拟API服务
class AuthService {
  private baseURL = '/api/auth';

  // 模拟用户数据
  private mockUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      roles: [
        {
          id: '1',
          name: 'Administrator',
          description: '系统管理员',
          permissions: [
            {
              id: '1',
              name: '用户创建',
              resource: 'user',
              action: 'create',
              description: '创建用户',
            },
            {
              id: '2',
              name: '用户查看',
              resource: 'user',
              action: 'read',
              description: '查看用户',
            },
            {
              id: '3',
              name: '用户更新',
              resource: 'user',
              action: 'update',
              description: '更新用户',
            },
            {
              id: '4',
              name: '用户删除',
              resource: 'user',
              action: 'delete',
              description: '删除用户',
            },
            {
              id: '5',
              name: '角色管理',
              resource: 'role',
              action: 'create',
              description: '角色管理',
            },
            {
              id: '6',
              name: '仪表盘查看',
              resource: 'dashboard',
              action: 'view',
              description: '查看仪表盘',
            },
            {
              id: '7',
              name: '个人资料查看',
              resource: 'profile',
              action: 'view',
              description: '查看个人资料',
            },
            {
              id: '8',
              name: '个人资料更新',
              resource: 'profile',
              action: 'update',
              description: '更新个人资料',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      roles: [
        {
          id: '2',
          name: 'User',
          description: '普通用户',
          permissions: [
            {
              id: '6',
              name: '仪表盘查看',
              resource: 'dashboard',
              action: 'view',
              description: '查看仪表盘',
            },
            {
              id: '7',
              name: '个人资料查看',
              resource: 'profile',
              action: 'view',
              description: '查看个人资料',
            },
            {
              id: '8',
              name: '个人资料更新',
              resource: 'profile',
              action: 'update',
              description: '更新个人资料',
            },
          ],
        },
      ],
    },
  ];

  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(
      (u) => u.username === credentials.username,
    );

    if (!user || credentials.password !== 'password') {
      throw new Error('用户名或密码错误');
    }

    const token = 'mock-jwt-token-' + user.id;

    return { user, token };
  }

  async getCurrentUser(): Promise<User> {
    // 模拟获取当前用户信息
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockUsers[0];
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }

    this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...data };
    return this.mockUsers[userIndex];
  }
}

export const authService = new AuthService();
