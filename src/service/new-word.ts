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
import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { PageResult } from '@/types';
import {
  BatchCreateNewWordsRequest,
  BatchDeleteNewWordsRequest,
  BatchUpdateNewWordsRequest,
  BatchUpdateNewWordsResponse,
  CreateNewWordRequest,
  ExportNewWordsRequest,
  ImportNewWordsRequest,
  ImportNewWordsResponse,
  ListNewWordsRequest,
  NewWord,
  NewWordDetail,
  UpdateNewWordRequest,
} from '@/types/new-word';
import { AxiosResponse } from 'axios';

/**
 * Retrieve newWord details.
 *
 * @param Unique ID of the newWord resource.
 * @returns The newWord object containing all its details.
 */
export function getNewWord(id: string) {
  return httpClient.get<NewWordDetail>(`/newWords/${id}`);
}

/**
 * List newWords with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of newWords and total count.
 */
export function listNewWords(req: Partial<ListNewWordsRequest>) {
  return httpClient.get<PageResult<NewWord>>('/newWords', req);
}

/**
 * Create a new newWord.
 *
 * @param req Request object containing newWord creation data.
 * @returns The newWord object.
 */
export function createNewWord(req: CreateNewWordRequest) {
  return httpClient.post<number>('/newWords', req);
}

/**
 * Update an existing newWord.
 *
 * @param req Request object containing newWord update data.
 */
export function updateNewWord(req: UpdateNewWordRequest) {
  return httpClient.put<NewWord>('/newWords', req);
}

/**
 * Delete newWord by ID
 *
 * @param id The ID of the newWord to delete.
 */
export function deleteNewWord(id: string) {
  return httpClient.delete<void>(`/newWords/${id}`);
}

/**
 *  Batch create newWords.
 *
 * @param req Request body containing a list of newWord creation items.
 * @returns Response containing the list of created newWords.
 */
export function batchCreateNewWords(req: BatchCreateNewWordsRequest) {
  return httpClient.post<number[]>('/newWords:batchCreate', req);
}

/**
 * Batch updates multiple newWords in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateNewWords(req: BatchUpdateNewWordsRequest) {
  return httpClient.put<BatchUpdateNewWordsResponse>(
    '/newWord:batchUpdate',
    req,
  );
}

/**
 * Batch delete newWords.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteNewWord(req: BatchDeleteNewWordsRequest) {
  return httpClient.delete<void>('/newWords:batchDelete', { data: req });
}

/**
 *  Export the Excel template for newWord import.
 *
 */
export async function exportNewWordTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/newWords:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'newWord_import_tpl.xlsx');
}

/**
 * Export newWord data based on the provided newWord IDs.
 *
 * @param req Query parameters specifying the newWords to export.
 */
export async function exportNewWord(req: ExportNewWordsRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/newWords:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'newWord_data_export.xlsx');
}

/**
 * Import newWords from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed newWord data.
 */
export function importNewWord(req: ImportNewWordsRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportNewWordsResponse>('/newWords:import', formData);
}
