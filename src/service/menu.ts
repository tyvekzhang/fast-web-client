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
  BatchCreateMenusRequest,
  BatchDeleteMenusRequest,
  BatchUpdateMenusRequest,
  BatchUpdateMenusResponse,
  CreateMenuRequest,
  ExportMenusRequest,
  ImportMenusRequest,
  ImportMenusResponse,
  ListMenusRequest,
  Menu,
  MenuDetail,
  UpdateMenuRequest,
} from '@/types/menu';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

/**
 * Retrieve menu details.
 *
 * @param ID of the menu resource.
 * @returns The menu object containing all its details.
 */
export function useMenu(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<MenuDetail>(
    id ? `/menus/${id}` : null,
    fetcher,
  );

  return {
    menu: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List menus with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of menus and total count.
 */
export function useMenus(req: Partial<ListMenusRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<Menu>
  >(['/menus', req], ([url, params]) => fetcher(url, params));

  return {
    menus: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateMenus: mutate,
  };
}

/**
 * Create a new menu.
 *
 * @param req Request object containing menu creation data.
 * @returns The menu object.
 */
export function createMenu(req: CreateMenuRequest) {
  return httpClient.post<number>('/menus', req);
}

/**
 * Update an existing menu.
 *
 * @param req Request object containing menu update data.
 */
export function updateMenu(req: UpdateMenuRequest) {
  return httpClient.put<Menu>('/menus', req);
}

/**
 * Delete menu by ID
 *
 * @param id The ID of the menu to delete.
 */
export function deleteMenu(id: string) {
  return httpClient.delete<void>(`/menus/${id}`);
}

/**
 *  Batch create menus.
 *
 * @param req Request body containing a list of menu creation items.
 * @returns Response containing the list of created menus.
 */
export function batchCreateMenus(req: BatchCreateMenusRequest) {
  return httpClient.post<number[]>('/menus:batchCreate', req);
}

/**
 * Batch updates multiple menus in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateMenus(req: BatchUpdateMenusRequest) {
  return httpClient.put<BatchUpdateMenusResponse>('/menu:batchUpdate', req);
}

/**
 * Batch delete menus.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteMenu(req: BatchDeleteMenusRequest) {
  return httpClient.delete<void>('/menus:batchDelete', { data: req });
}

/**
 *  Export the Excel template for menu import.
 *
 */
export async function exportMenuTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/menus:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'menu_import_tpl.xlsx');
}

/**
 * Export menu data based on the provided menu IDs.
 *
 * @param req Query parameters specifying the menus to export.
 */
export async function exportMenu(req: ExportMenusRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/menus:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'menu_data_export.xlsx');
}

/**
 * Import menus from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed menu data.
 */
export function importMenu(req: ImportMenusRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportMenusResponse>('/menus:import', formData);
}
