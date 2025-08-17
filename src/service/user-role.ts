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
import { AssignUserRoles } from '@/types/auth';
import {
  BatchCreateUserRolesRequest,
  BatchDeleteUserRolesRequest,
  BatchUpdateUserRolesRequest,
  BatchUpdateUserRolesResponse,
  CreateUserRoleRequest,
  ExportUserRolesRequest,
  ImportUserRolesRequest,
  ImportUserRolesResponse,
  ListUserRolesRequest,
  UpdateUserRoleRequest,
  UserRole,
  UserRoleDetail,
} from '@/types/user-role';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

export function assignUserRoles(req: AssignUserRoles) {
  return httpClient.post<void>('/userRoles:assign', req);
}

/**
 * Retrieve userRole details.
 *
 * @param ID of the userRole resource.
 * @returns The userRole object containing all its details.
 */
export function useUserRole(id: string) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<UserRoleDetail>(id ? `/userRoles/${id}` : null, fetcher);

  return {
    userRole: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List userRoles with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of userRoles and total count.
 */
export function useUserRoles(req: Partial<ListUserRolesRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<UserRole>
  >(['/userRoles', req], ([url, params]) => fetcher(url, params));

  return {
    userRoles: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateUserRoles: mutate,
  };
}

/**
 * Create a new userRole.
 *
 * @param req Request object containing userRole creation data.
 * @returns The userRole object.
 */
export function createUserRole(req: CreateUserRoleRequest) {
  return httpClient.post<number>('/userRoles', req);
}

/**
 * Update an existing userRole.
 *
 * @param req Request object containing userRole update data.
 */
export function updateUserRole(req: UpdateUserRoleRequest) {
  return httpClient.put<UserRole>('/userRoles', req);
}

/**
 * Delete userRole by ID
 *
 * @param id The ID of the userRole to delete.
 */
export function deleteUserRole(id: string) {
  return httpClient.delete<void>(`/userRoles/${id}`);
}

/**
 *  Batch create userRoles.
 *
 * @param req Request body containing a list of userRole creation items.
 * @returns Response containing the list of created userRoles.
 */
export function batchCreateUserRoles(req: BatchCreateUserRolesRequest) {
  return httpClient.post<number[]>('/userRoles:batchCreate', req);
}

/**
 * Batch updates multiple userRoles in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateUserRoles(req: BatchUpdateUserRolesRequest) {
  return httpClient.put<BatchUpdateUserRolesResponse>(
    '/userRole:batchUpdate',
    req,
  );
}

/**
 * Batch delete userRoles.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteUserRole(req: BatchDeleteUserRolesRequest) {
  return httpClient.delete<void>('/userRoles:batchDelete', { data: req });
}

/**
 *  Export the Excel template for userRole import.
 *
 */
export async function exportUserRoleTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/userRoles:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'userRole_import_tpl.xlsx');
}

/**
 * Export userRole data based on the provided userRole IDs.
 *
 * @param req Query parameters specifying the userRoles to export.
 */
export async function exportUserRole(req: ExportUserRolesRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/userRoles:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'userRole_data_export.xlsx');
}

/**
 * Import userRoles from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed userRole data.
 */
export function importUserRole(req: ImportUserRolesRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportUserRolesResponse>(
    '/userRoles:import',
    formData,
  );
}
