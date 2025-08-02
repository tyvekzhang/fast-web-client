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
  BatchCreateTablesRequest,
  BatchDeleteTablesRequest,
  BatchUpdateTablesRequest,
  BatchUpdateTablesResponse,
  CreateTableRequest,
  ExportTablesRequest,
  ImportTablesRequest,
  ImportTablesResponse,
  ListTablesRequest,
  Table,
  TableDetail,
  UpdateTableRequest,
} from '@/types/table';
import { AxiosResponse } from 'axios';

/**
 * Retrieve table details.
 *
 * @param Unique ID of the table resource.
 * @returns The table object containing all its details.
 */
export function getTable(id: string) {
  return httpClient.get<TableDetail>(`/tables/${id}`);
}

/**
 * List tables with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of tables and total count.
 */
export function listTables(req: Partial<ListTablesRequest>) {
  return httpClient.get<PageResult<Table>>('/tables', req);
}

/**
 * Create a new table.
 *
 * @param req Request object containing table creation data.
 * @returns The table object.
 */
export function createTable(req: CreateTableRequest) {
  return httpClient.post<number>('/tables', req);
}

/**
 * Update an existing table.
 *
 * @param req Request object containing table update data.
 */
export function updateTable(req: UpdateTableRequest) {
  return httpClient.put<Table>('/tables', req);
}

/**
 * Delete table by ID
 *
 * @param id The ID of the table to delete.
 */
export function deleteTable(id: string) {
  return httpClient.delete<void>(`/tables/${id}`);
}

/**
 *  Batch create tables.
 *
 * @param req Request body containing a list of table creation items.
 * @returns Response containing the list of created tables.
 */
export function batchCreateTables(req: BatchCreateTablesRequest) {
  return httpClient.post<number[]>('/tables:batchCreate', req);
}

/**
 * Batch updates multiple tables in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateTables(req: BatchUpdateTablesRequest) {
  return httpClient.put<BatchUpdateTablesResponse>('/table:batchUpdate', req);
}

/**
 * Batch delete tables.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteTable(req: BatchDeleteTablesRequest) {
  return httpClient.delete<void>('/tables:batchDelete', { data: req });
}

/**
 *  Export the Excel template for table import.
 *
 */
export async function exportTableTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/tables:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'table_import_tpl.xlsx');
}

/**
 * Export table data based on the provided table IDs.
 *
 * @param req Query parameters specifying the tables to export.
 */
export async function exportTable(req: ExportTablesRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/tables:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'table_data_export.xlsx');
}

/**
 * Import tables from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed table data.
 */
export function importTable(req: ImportTablesRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportTablesResponse>('/tables:import', formData);
}
