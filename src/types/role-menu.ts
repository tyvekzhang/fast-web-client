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

export interface ListRoleMenusRequest extends PaginationRequest {
  id: string;

  create_time: string;
}

export interface RoleMenu {
  id: string;

  role_id: string;

  menu_id: string;

  create_time: string;
}

export interface RoleMenuDetail extends RoleMenu {}

export interface CreateRoleMenu {
  role_id: string;

  menu_id: string;
}

export interface CreateRoleMenuRequest {
  roleMenu: CreateRoleMenu;
}

export interface UpdateRoleMenu {
  id: string;

  role_id: string;

  menu_id: string;
}

export interface UpdateRoleMenuRequest {
  roleMenu: UpdateRoleMenu;
}

export interface BatchGetRoleMenusResponse {
  roleMenus: RoleMenuDetail[];
}

export interface BatchCreateRoleMenusRequest {
  roleMenus: CreateRoleMenu[];
}

export interface BatchCreateRoleMenuResponse {
  roleMenus: RoleMenu[];
}

export interface BatchUpdateRoleMenu {
  role_id: string;

  menu_id: string;
}

export interface BatchUpdateRoleMenusRequest {
  ids: string[];
  roleMenu: BatchUpdateRoleMenu;
}

export interface BatchPatchRoleMenusRequest {
  roleMenus: UpdateRoleMenu[];
}

export interface BatchUpdateRoleMenusResponse {
  roleMenus: RoleMenu[];
}

export interface BatchDeleteRoleMenusRequest {
  ids: string[];
}

export interface ExportRoleMenu extends RoleMenu {}

export interface ExportRoleMenusRequest {
  ids: string[];
}

export interface ImportRoleMenusRequest {
  file: File;
}

export interface ImportRoleMenu extends CreateRoleMenu {
  errMsg: string;
}

export interface ImportRoleMenusResponse {
  roleMenus: ImportRoleMenu[];
}
