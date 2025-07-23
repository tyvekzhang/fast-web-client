import { downloadBlob } from '@/service/util';
import { CodePreviewResponse, GenTableDetail, TableDataResponse } from '@/types/code-gen';
import httpClient from '@/lib/http';
import { AxiosResponse } from 'axios';

export const codeModify = (genTableDetail: GenTableDetail) => {
  return httpClient.put<void>(`/gen-table/modify`, genTableDetail);
};

export const getTableDetail = (tableId: number) => {
  return httpClient.get<GenTableDetail>(`/gen-table/detail/${tableId}`);
};

export const codePreview = (tableId: number) => {
  return httpClient.get<CodePreviewResponse>(`/gen-table/preview/${tableId}`);
};

export const codeList = () => {
  return httpClient.get<TableDataResponse>(`/gen-table/list`);
};

export const importTables = (database_id: number, tableIds: number[], backend: string) => {
  const data = {
    database_id: database_id,
    table_ids: tableIds,
    backend: backend
  };
  return httpClient.post('/gen-table/import', data);
};

export const downloadCode = async (tableId: number, fileName: string = 'code.zip') => {
  const response = await httpClient.get<AxiosResponse>(
    `/gen-table/download/${tableId}`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, fileName);
};

export const syncTable = (tableId: number) => {
  return httpClient.post(`/gen-table/sync/${tableId}`);
};

export const deleteTable = (tableId: number) => {
  return httpClient.delete(`/gen-table/remove/${tableId}`);
};
