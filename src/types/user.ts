// Copyright (c) 2025 FastWeb and/or its affiliates. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { PaginationRequest } from '.';

export interface ListUsersRequest extends PaginationRequest {
  id: string;

  username: string;

  nickname: string;

  status: number;

  create_time: string;
}

export interface User {
  id: string;

  username: string;

  nickname: string;

  avatar_url: string;

  status: number;

  remark: string;

  create_time: string;
}

export interface UserDetail extends User {}

export interface CreateUser {
  username: string;

  password: string;

  nickname: string;

  avatar_url: string;

  status: number;

  remark: string;
}

export interface CreateUserRequest {
  user: CreateUser;
}

export interface UpdateUser {
  id: string;

  username: string;

  password: string;

  nickname: string;

  avatar_url: string;

  status: number;

  remark: string;
}

export interface UpdateUserRequest {
  user: UpdateUser;
}

export interface BatchGetUsersResponse {
  users: UserDetail[];
}

export interface BatchCreateUsersRequest {
  users: CreateUser[];
}

export interface BatchCreateUserResponse {
  users: User[];
}

export interface BatchUpdateUser {
  avatar_url: string;

  status: number;
}

export interface BatchUpdateUsersRequest {
  ids: string[];
  user: BatchUpdateUser;
}

export interface BatchPatchUsersRequest {
  users: UpdateUser[];
}

export interface BatchUpdateUsersResponse {
  users: User[];
}

export interface BatchDeleteUsersRequest {
  ids: string[];
}

export interface ExportUser extends User {}

export interface ExportUsersRequest {
  ids: string[];
}

export interface ImportUsersRequest {
  file: File;
}

export interface ImportUser extends CreateUser {
  errMsg: string;
}

export interface ImportUsersResponse {
  users: ImportUser[];
}
