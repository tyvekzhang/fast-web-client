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
  BatchCreateDictDataRequest,
  BatchDeleteDictDataRequest,
  BatchUpdateDictDataRequest,
  BatchUpdateDictDataResponse,
  CreateDictDatumRequest,
  DictDataOption,
  DictDataOptionItem,
  DictDatum,
  DictDatumDetail,
  ExportDictDataRequest,
  ImportDictDataRequest,
  ImportDictDataResponse,
  ListDictDataRequest,
  UpdateDictDatumRequest,
} from '@/types/dict-datum';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

export function getLabelByValue(
  dictData: Record<string, DictDataOptionItem[]>,
  key: string,
  value: any,
) {
  if (dictData === null || dictData === undefined) {
    return '-';
  }
  const item = dictData[key].find((item) => item.value === value);
  return item ? item.label : '-';
}

/**
 * Retrieve dictDatum details.
 *
 * @param ID of the dictDatum resource.
 * @returns The dictDatum object containing all its details.
 */
export function useDictDatum(id: string) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<DictDatumDetail>(id ? `/dictData/${id}` : null, fetcher);

  return {
    dictDatum: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List dictData with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of dictData and total count.
 */
export function useDictData(req: Partial<ListDictDataRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<DictDatum>
  >(['/dictData', req], ([url, params]) => fetcher(url, params));

  return {
    dictData: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateDictData: mutate,
  };
}

/**
 * Fetch all dictionary data grouped by type.
 * @returns Dictionary options for the requested types.
 */
export function useAllDictData() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<DictDataOption>(['/dictData:all'], ([url]) => fetcher(url));

  return {
    dictData: data?.options,
    isLoading,
    isError: error,
    isValidating,
    refresh: mutate,
  };
}

/**
 * Fetch dictionary options for specific types.
 * @param types Array of dictionary types to fetch (e.g., ['gender', 'status']).
 * @returns Dictionary options for the requested types.
 */
export function useDictDataOptions(req: string[]) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<DictDataOption>(
      ['/dictData:options', { req: req }],
      ([url, params]) => fetcher(url, params),
    );

  return {
    dictData: data?.options || {},
    isLoading,
    isError: error,
    isValidating,
    refresh: mutate,
  };
}

/**
 * Create a new dictDatum.
 *
 * @param req Request object containing dictDatum creation data.
 * @returns The dictDatum object.
 */
export function createDictDatum(req: CreateDictDatumRequest) {
  return httpClient.post<number>('/dictData', req);
}

/**
 * Update an existing dictDatum.
 *
 * @param req Request object containing dictDatum update data.
 */
export function updateDictDatum(req: UpdateDictDatumRequest) {
  return httpClient.put<DictDatum>('/dictData', req);
}

/**
 * Delete dictDatum by ID
 *
 * @param id The ID of the dictDatum to delete.
 */
export function deleteDictDatum(id: string) {
  return httpClient.delete<void>(`/dictData/${id}`);
}

/**
 *  Batch create dictData.
 *
 * @param req Request body containing a list of dictDatum creation items.
 * @returns Response containing the list of created dictData.
 */
export function batchCreateDictData(req: BatchCreateDictDataRequest) {
  return httpClient.post<number[]>('/dictData:batchCreate', req);
}

/**
 * Batch updates multiple dictData in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateDictData(req: BatchUpdateDictDataRequest) {
  return httpClient.put<BatchUpdateDictDataResponse>(
    '/dictDatum:batchUpdate',
    req,
  );
}

/**
 * Batch delete dictData.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteDictDatum(req: BatchDeleteDictDataRequest) {
  return httpClient.delete<void>('/dictData:batchDelete', { data: req });
}

/**
 *  Export the Excel template for dictDatum import.
 *
 */
export async function exportDictDatumTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/dictData:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'dictDatum_import_tpl.xlsx');
}

/**
 * Export dictDatum data based on the provided dictDatum IDs.
 *
 * @param req Query parameters specifying the dictData to export.
 */
export async function exportDictDatum(req: ExportDictDataRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/dictData:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'dictDatum_data_export.xlsx');
}

/**
 * Import dictData from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed dictDatum data.
 */
export function importDictDatum(req: ImportDictDataRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportDictDataResponse>('/dictData:import', formData);
}
