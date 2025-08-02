import httpClient from '@/lib/http';
import { PageResult } from '@/types';
import { TableResponse } from '@/types/code-gen';
import { PageData } from '@/types/common';
import {
  Connection,
  ConnectionCreate,
  ConnectionQueryResponse,
  Database,
  GenTableExecute,
  ListConnectionsRequest,
  ListDatabasesRequest,
  SQLSchema,
  TableAdd,
  TableColumn,
  TableIndex,
  TableMetadata,
} from '@/types/db-manage';
import { ListTablesRequest } from '@/types/table';

/**
 * List connections with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of connections and total count.
 */
export function listConnections(req?: Partial<ListConnectionsRequest>) {
  return httpClient.get<PageResult<Connection>>('/connections', req);
}

/**
 * List databases with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of databases and total count.
 */
export function listDatabases(req?: Partial<ListDatabasesRequest>) {
  return httpClient.get<PageResult<Database>>('/databases', req);
}

/**
 * List tables with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of tables and total count.
 */
export function listTables(req?: Partial<ListTablesRequest>) {
  return httpClient.get<PageResult<TableResponse>>('/tables', req);
}

/**
 * List available tables with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of available tables and total count.
 */
export function listAvailableTables(req?: Partial<ListTablesRequest>) {
  return httpClient.get<PageResult<TableResponse>>('metaTables:available', req);
}

export const executeSQL = (genTableExecute: GenTableExecute) => {
  return httpClient.post<any>('/gen-table/execute', genTableExecute);
};

export const fetchDynamicColumns = (id: number) => {
  return httpClient.get(`/field/antd/${id}`);
};

export const fetchConnection = async (connectionId: number) => {
  return httpClient.get<ConnectionQueryResponse>(
    '/connection/query/' + connectionId,
  );
};

export const fetchDatabases = async (
  connectionId: number,
): Promise<Database[]> => {
  const params = {
    current: 1,
    page_size: 200,
    connection_id: connectionId,
  };
  return httpClient
    .get<PageData<Database>>('/database/databases', params)
    .then((res) => {
      return res.records;
    });
};

export const fetchDynamicTableData = async (tableId: number) => {
  const params = {
    currentPage: 1,
    page_size: 10,
    table_id: tableId,
  };

  return httpClient.get<PageData<any>>(
    `/gen-table/data/${params.table_id}/${params.currentPage}/${params.page_size}`,
  );
};

export const fetchTableStructure = async (tableId: number) => {
  const params = {
    currentPage: 1,
    page_size: 1000,
    table_id: tableId,
  };

  return httpClient
    .get<PageData<TableColumn>>('/field/fields', params)
    .then((res) => {
      const records = res.records;
      if (records) {
        return records.map((prev) => ({
          ...prev,
          key: prev.id?.toString(),
        }));
      }
      return [];
    });
};
export const fetchIndexStructure = async (
  tableId: number,
): Promise<TableIndex[]> => {
  const params = {
    currentPage: 1,
    page_size: 1000,
    table_id: tableId,
  };
  return httpClient
    .get<PageData<TableIndex>>('/index/indexes', params)
    .then((res) => {
      return res.records;
    });
};

export const tableAdd = async (data: TableAdd): Promise<void> => {
  const tableAdd = {
    database_id: data.databaseId,
    name: data.tableName,
  };
  return httpClient.post('/table/add', tableAdd);
};

export const tableGenerate = async (
  database_id: number,
  tableMetadata: TableMetadata,
  fieldData: TableColumn[],
  indexData: TableIndex[],
) => {
  const tableGenerate = {
    database_id: database_id,
    table_name: tableMetadata.table_name,
    comment: tableMetadata.comment,
    field_metadata: fieldData,
    index_metadata: indexData,
  };
  return httpClient.post('/table/generate', tableGenerate);
};

export const createConnection = (data: ConnectionCreate) => {
  return httpClient.post('/connection/create', data);
};

export const createDatabase = (data: SQLSchema) => {
  return httpClient.post('/database/create', data);
};
