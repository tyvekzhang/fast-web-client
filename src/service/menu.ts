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
 * Retrieve menu details with SWR.
 *
 * @param id Unique ID of the menu resource.
 * @returns SWR response containing the menu object and loading/error states.
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
 * List menus with pagination using SWR.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns SWR response containing paginated list of menus and loading/error states.
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
export async function exportMenuPage(req: ExportMenusRequest) {
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
 * @param req The request with excel file to import.
 * @returns  List of successfully parsed menu data.
 */
export function importMenu(req: ImportMenusRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportMenusResponse>('/menus:import', formData);
}
