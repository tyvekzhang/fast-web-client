export type LoginRequest = {
    username: string;
    password: string;
}

export type Token = {
  access_token: string
  expires_in: number
  refresh_token: string
}


export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}


export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type PermissionResource =
  | 'user'
  | 'role'
  | 'permission'
  | 'dashboard'
  | 'profile';
