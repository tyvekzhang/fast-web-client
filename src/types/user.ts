import { ModelBase, PageBase } from '@/types/common';

export type LoginForm = {
  username: string;
  password: string;
  remember: boolean;
};

export interface Token {
  access_token: string;
  token_type: string;
  expired_at: number;
  refresh_token: string;
  re_expired_at: number;
}

export interface UserAdd {
  username: string;
  password: string;
  nickname: string;
  remark?: string;
}

export interface UserQueryForm extends PageBase {
  username?: string;
  nickname?: string;
  status?: number;
  create_time?: string;
}

export interface UserQuery extends ModelBase {
  username: string;
  password: string;
  nickname: string;
  status: number;
  remark?: string;
}

export interface UserTableData {
  records?: UserQuery[];
  total_count?: number;
}

export type UserModify = UserQuery;

export interface UserBatchModify {
  password?: string;
  status?: number;
  remark?: string;
}

export interface UserRoleAssign {
  user_id: string;
  role_ids: string[];
}
