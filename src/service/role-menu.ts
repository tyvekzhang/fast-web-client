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
  BatchCreateRoleMenusRequest,
  BatchDeleteRoleMenusRequest,
  BatchUpdateRoleMenusRequest,
  BatchUpdateRoleMenusResponse,
  CreateRoleMenuRequest,
  ExportRoleMenusRequest,
  ImportRoleMenusRequest,
  ImportRoleMenusResponse,
  ListRoleMenusRequest,
  RoleMenu,
  RoleMenuDetail,
  UpdateRoleMenuRequest,
} from '@/types/role-menu';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

/**
 * Retrieve roleMenu details.
 *
 * @param ID of the roleMenu resource.
 * @returns The roleMenu object containing all its details.
 */
export function useRoleMenu(id: string) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<RoleMenuDetail>(id ? `/roleMenus/${id}` : null, fetcher);

  return {
    roleMenu: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List roleMenus with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of roleMenus and total count.
 */
export function useRoleMenus(req: Partial<ListRoleMenusRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<RoleMenu>
  >(['/roleMenus', req], ([url, params]) => fetcher(url, params));

  return {
    roleMenus: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateRoleMenus: mutate,
  };
}

/**
 * Create a new roleMenu.
 *
 * @param req Request object containing roleMenu creation data.
 * @returns The roleMenu object.
 */
export function createRoleMenu(req: CreateRoleMenuRequest) {
  return httpClient.post<number>('/roleMenus', req);
}

/**
 * Update an existing roleMenu.
 *
 * @param req Request object containing roleMenu update data.
 */
export function updateRoleMenu(req: UpdateRoleMenuRequest) {
  return httpClient.put<RoleMenu>('/roleMenus', req);
}

/**
 * Delete roleMenu by ID
 *
 * @param id The ID of the roleMenu to delete.
 */
export function deleteRoleMenu(id: string) {
  return httpClient.delete<void>(`/roleMenus/${id}`);
}

/**
 *  Batch create roleMenus.
 *
 * @param req Request body containing a list of roleMenu creation items.
 * @returns Response containing the list of created roleMenus.
 */
export function batchCreateRoleMenus(req: BatchCreateRoleMenusRequest) {
  return httpClient.post<number[]>('/roleMenus:batchCreate', req);
}

/**
 * Batch updates multiple roleMenus in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateRoleMenus(req: BatchUpdateRoleMenusRequest) {
  return httpClient.put<BatchUpdateRoleMenusResponse>(
    '/roleMenu:batchUpdate',
    req,
  );
}

/**
 * Batch delete roleMenus.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteRoleMenu(req: BatchDeleteRoleMenusRequest) {
  return httpClient.delete<void>('/roleMenus:batchDelete', { data: req });
}

/**
 *  Export the Excel template for roleMenu import.
 *
 */
export async function exportRoleMenuTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/roleMenus:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'roleMenu_import_tpl.xlsx');
}

/**
 * Export roleMenu data based on the provided roleMenu IDs.
 *
 * @param req Query parameters specifying the roleMenus to export.
 */
export async function exportRoleMenu(req: ExportRoleMenusRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/roleMenus:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'roleMenu_data_export.xlsx');
}

/**
 * Import roleMenus from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed roleMenu data.
 */
export function importRoleMenu(req: ImportRoleMenusRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportRoleMenusResponse>(
    '/roleMenus:import',
    formData,
  );
}
