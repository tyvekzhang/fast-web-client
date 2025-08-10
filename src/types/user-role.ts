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

export interface ListUserRolesRequest extends PaginationRequest {
  id?: string;

  create_time?: string;
}

export interface UserRole {
  id: string;

  role_id: string;

  create_time: string;
}

export interface UserRoleDetail extends UserRole {}

export interface CreateUserRole {
  role_id: string;
}

export interface CreateUserRoleRequest {
  userRole: CreateUserRole;
}

export interface UpdateUserRole {
  id: string;

  role_id: string;
}

export interface UpdateUserRoleRequest {
  userRole: UpdateUserRole;
}

export interface BatchGetUserRolesResponse {
  userRoles: UserRoleDetail[];
}

export interface BatchCreateUserRolesRequest {
  userRoles: CreateUserRole[];
}

export interface BatchCreateUserRoleResponse {
  userRoles: UserRole[];
}

export interface BatchUpdateUserRole {
  role_id: string;
}

export interface BatchUpdateUserRolesRequest {
  ids: string[];
  userRole: BatchUpdateUserRole;
}

export interface BatchPatchUserRolesRequest {
  userRoles: UpdateUserRole[];
}

export interface BatchUpdateUserRolesResponse {
  userRoles: UserRole[];
}

export interface BatchDeleteUserRolesRequest {
  ids: string[];
}

export interface ExportUserRole extends UserRole {}

export interface ExportUserRolesRequest {
  ids: string[];
}

export interface ImportUserRolesRequest {
  file: File;
}

export interface ImportUserRole extends CreateUserRole {
  errMsg: string;
}

export interface ImportUserRolesResponse {
  userRoles: ImportUserRole[];
}
