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

export interface ListRolesRequest extends PaginationRequest {
  id: string;

  name: string;

  code: string;

  create_time: string;
}

export interface Role {
  id: string;

  name: string;

  code: string;

  sort: number;

  operation_type: string;

  data_scope: number;

  data_scope_dept_ids: string;

  status: number;

  comment: string;

  create_time: string;
}

export interface RoleDetail extends Role {
  menu_ids: number[];
}

export interface CreateRole {
  name: string;

  code: string;

  sort: number;

  operation_type: string;

  data_scope: number;

  data_scope_dept_ids: string;

  status: number;

  comment: string;
}

export interface CreateRoleRequest {
  role: CreateRole;
}

export interface UpdateRole {
  id: string;

  name: string;

  code: string;

  sort: number;

  operation_type: string | string[];

  data_scope: number;

  data_scope_dept_ids: string;

  status: number;

  comment: string;
}

export interface UpdateRoleRequest {
  role: UpdateRole;
}

export interface BatchGetRolesResponse {
  roles: RoleDetail[];
}

export interface BatchCreateRolesRequest {
  roles: CreateRole[];
}

export interface BatchCreateRoleResponse {
  roles: Role[];
}

export interface BatchUpdateRole {
  name: string;

  code: string;

  sort: number;

  operation_type: string;

  data_scope: number;

  data_scope_dept_ids: string;

  status: number;

  comment: string;
}

export interface BatchUpdateRolesRequest {
  ids: string[];
  role: BatchUpdateRole;
}

export interface BatchPatchRolesRequest {
  roles: UpdateRole[];
}

export interface BatchUpdateRolesResponse {
  roles: Role[];
}

export interface BatchDeleteRolesRequest {
  ids: string[];
}

export interface ExportRole extends Role {}

export interface ExportRolesRequest {
  ids: string[];
}

export interface ImportRolesRequest {
  file: File;
}

export interface ImportRole extends CreateRole {
  errMsg: string;
}

export interface ImportRolesResponse {
  roles: ImportRole[];
}
