import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { PageResult } from '@/types';
import {
  CodePreviewResponse,
  FieldResponse,
  GenTableDetail,
  TableResponse,
  TableResult,
} from '@/types/code-gen';
import { ListTablesRequest } from '@/types/table';
import { AxiosResponse } from 'axios';

/**
 * List tables with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of tables and total count.
 */
export function listTables(req: Partial<ListTablesRequest>) {
  return httpClient.get<PageResult<TableResponse>>('/tables', req);
}

export const codePreview = (id: string) => {
  return httpClient.get<CodePreviewResponse>(`/tables:preview/${id}`);
};

export const getTableDetail = (tableId: string) => {
  return httpClient.get<GenTableDetail>(`/tables/${tableId}`);
};

export const codeModify = (genTableDetail: GenTableDetail) => {
  return httpClient.put<void>(`/tables`, genTableDetail);
};

export const importTables = (
  database_id: string,
  tableIds: string[],
  backend: string,
) => {
  const data = {
    database_id: database_id,
    table_ids: tableIds,
    backend: backend,
  };
  return httpClient.post('/tables:import', data);
};

export const downloadCode = async (
  tableIds: string | string[], // Accept single ID or array of IDs
  fileName?: string, // Make optional
) => {
  // Handle both single ID and array cases
  const ids = Array.isArray(tableIds) ? tableIds : [tableIds];

  // Build URL with multiple IDs if needed
  const url =
    ids.length === 1
      ? `/tables:download?table_id=${ids[0]}`
      : `/tables:download?table_id=${ids.join('&table_id=')}`;

  const response = await httpClient.get<AxiosResponse>(
    url,
    {},
    {
      responseType: 'blob',
    },
  );

  if (typeof window !== 'undefined') {
    // Generate filename if not provided
    const finalFileName =
      fileName ||
      (ids.length === 1
        ? `table_${ids[0]}_code.zip`
        : `tables_bundle_${new Date().toISOString().slice(0, 10)}.zip`);

    downloadBlob(response, finalFileName);
  }
};

export const syncTable = (tableId: string) => {
  return httpClient.post(`/tables:sync/${tableId}`);
};

export const deleteTable = (tableId: string) => {
  return httpClient.delete(`/tables/${tableId}`);
};

export const getAllTables = () => {
  return httpClient.get<TableResult[]>('/tables:all');
};

export const getTableFieldsById = (tableId: string) => {
  return httpClient.get<FieldResponse[]>(`/tables:fields/${tableId}`);
};
