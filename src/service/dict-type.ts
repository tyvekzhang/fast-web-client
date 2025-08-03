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
  BatchCreateDictTypesRequest,
  BatchDeleteDictTypesRequest,
  BatchUpdateDictTypesRequest,
  BatchUpdateDictTypesResponse,
  CreateDictTypeRequest,
  DictType,
  DictTypeDetail,
  ExportDictTypesRequest,
  ImportDictTypesRequest,
  ImportDictTypesResponse,
  ListDictTypesRequest,
  UpdateDictTypeRequest,
} from '@/types/dict-type';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

/**
 * Retrieve dictType details.
 *
 * @param ID of the dictType resource.
 * @returns The dictType object containing all its details.
 */
export function useDictType(id: string) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<DictTypeDetail>(id ? `/dictTypes/${id}` : null, fetcher);

  return {
    dictType: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List dictTypes with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of dictTypes and total count.
 */
export function useDictTypes(req: Partial<ListDictTypesRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<DictType>
  >(['/dictTypes', req], ([url, params]) => fetcher(url, params));

  return {
    dictTypes: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateDictTypes: mutate,
  };
}

/**
 * Create a new dictType.
 *
 * @param req Request object containing dictType creation data.
 * @returns The dictType object.
 */
export function createDictType(req: CreateDictTypeRequest) {
  return httpClient.post<number>('/dictTypes', req);
}

/**
 * Update an existing dictType.
 *
 * @param req Request object containing dictType update data.
 */
export function updateDictType(req: UpdateDictTypeRequest) {
  return httpClient.put<DictType>('/dictTypes', req);
}

/**
 * Delete dictType by ID
 *
 * @param id The ID of the dictType to delete.
 */
export function deleteDictType(id: string) {
  return httpClient.delete<void>(`/dictTypes/${id}`);
}

/**
 *  Batch create dictTypes.
 *
 * @param req Request body containing a list of dictType creation items.
 * @returns Response containing the list of created dictTypes.
 */
export function batchCreateDictTypes(req: BatchCreateDictTypesRequest) {
  return httpClient.post<number[]>('/dictTypes:batchCreate', req);
}

/**
 * Batch updates multiple dictTypes in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateDictTypes(req: BatchUpdateDictTypesRequest) {
  return httpClient.put<BatchUpdateDictTypesResponse>(
    '/dictType:batchUpdate',
    req,
  );
}

/**
 * Batch delete dictTypes.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteDictType(req: BatchDeleteDictTypesRequest) {
  return httpClient.delete<void>('/dictTypes:batchDelete', { data: req });
}

/**
 *  Export the Excel template for dictType import.
 *
 */
export async function exportDictTypeTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/dictTypes:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'dictType_import_tpl.xlsx');
}

/**
 * Export dictType data based on the provided dictType IDs.
 *
 * @param req Query parameters specifying the dictTypes to export.
 */
export async function exportDictType(req: ExportDictTypesRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/dictTypes:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'dictType_data_export.xlsx');
}

/**
 * Import dictTypes from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed dictType data.
 */
export function importDictType(req: ImportDictTypesRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportDictTypesResponse>(
    '/dictTypes:import',
    formData,
  );
}
