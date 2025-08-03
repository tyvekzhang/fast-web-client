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
import httpClient, { fetcher } from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { PageResult } from '@/types';
import {
  BatchCreateRolesRequest,
  BatchDeleteRolesRequest,
  BatchUpdateRolesRequest,
  BatchUpdateRolesResponse,
  CreateRoleRequest,
  ExportRolesRequest,
  ImportRolesRequest,
  ImportRolesResponse,
  ListRolesRequest,
  Role,
  RoleDetail,
  UpdateRoleRequest,
} from '@/types/role';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

/**
 * Retrieve role details.
 *
 * @param ID of the role resource.
 * @returns The role object containing all its details.
 */
export function useRole(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<RoleDetail>(
    id ? `/roles/${id}` : null,
    fetcher,
  );

  return {
    role: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List roles with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of roles and total count.
 */
export function useRoles(req: Partial<ListRolesRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<Role>
  >(['/roles', req], ([url, params]) => fetcher(url, params));

  return {
    roles: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateRoles: mutate,
  };
}

/**
 * Create a new role.
 *
 * @param req Request object containing role creation data.
 * @returns The role object.
 */
export function createRole(req: CreateRoleRequest) {
  return httpClient.post<number>('/roles', req);
}

/**
 * Update an existing role.
 *
 * @param req Request object containing role update data.
 */
export function updateRole(req: UpdateRoleRequest) {
  return httpClient.put<Role>('/roles', req);
}

/**
 * Delete role by ID
 *
 * @param id The ID of the role to delete.
 */
export function deleteRole(id: string) {
  return httpClient.delete<void>(`/roles/${id}`);
}

/**
 *  Batch create roles.
 *
 * @param req Request body containing a list of role creation items.
 * @returns Response containing the list of created roles.
 */
export function batchCreateRoles(req: BatchCreateRolesRequest) {
  return httpClient.post<number[]>('/roles:batchCreate', req);
}

/**
 * Batch updates multiple roles in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateRoles(req: BatchUpdateRolesRequest) {
  return httpClient.put<BatchUpdateRolesResponse>('/role:batchUpdate', req);
}

/**
 * Batch delete roles.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteRole(req: BatchDeleteRolesRequest) {
  return httpClient.delete<void>('/roles:batchDelete', { data: req });
}

/**
 *  Export the Excel template for role import.
 *
 */
export async function exportRoleTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/roles:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'role_import_tpl.xlsx');
}

/**
 * Export role data based on the provided role IDs.
 *
 * @param req Query parameters specifying the roles to export.
 */
export async function exportRole(req: ExportRolesRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/roles:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'role_data_export.xlsx');
}

/**
 * Import roles from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed role data.
 */
export function importRole(req: ImportRolesRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportRolesResponse>('/roles:import', formData);
}
