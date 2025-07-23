import { PageData } from '@/types/common';
import {
  ConnectionCreate,
  ConnectionQueryResponse,
  Database,
  DatabaseConnection, GenTableExecute,
  SQLSchema,
  TableAdd,
  TableColumn,
  TableIndex,
  TableInfo,
  TableMetadata,
} from '@/types/db-manage';
import httpClient from '@/lib/http';

export const executeSQL = (genTableExecute: GenTableExecute) => {
  return httpClient.post<any>('/gen-table/execute', genTableExecute);
};

export const fetchDynamicColumns = (id: number) => {
  return httpClient.get(`/field/antd/${id}`);
}
export const fetchConnections = async (): Promise<DatabaseConnection[]> => {
  const params = {
    currentPage: 1,
    size: 100,
  };
  return httpClient.get<PageData<DatabaseConnection>>('/connection/connections', params).then((res) => {
    return res.records;
  });
};

export const fetchConnection = async (connectionId: number) => {
  return httpClient.get<ConnectionQueryResponse>('/connection/query/' + connectionId);
};

export const fetchDatabases = async (connectionId: number): Promise<Database[]> => {
  const params = {
    current: 1,
    pageSize: 200,
    connection_id: connectionId,
  };
  return httpClient.get<PageData<Database>>('/database/databases', params).then((res) => {
    return res.records;
  });
};

export const fetchTables = async (databaseId: number): Promise<TableInfo[]> => {
  const params = {
    currentPage: 1,
    pageSize: 1000,
    database_id: databaseId,
  };
  return httpClient.get<PageData<TableInfo>>('/table/tables', params).then((res) => {
    return res.records;
  });
};

export const listTables = async (params: Record<string, string>) => {
  return httpClient.get<PageData<TableInfo>>('/table/tables', params);
};

export const fetchDynamicTableData = async (tableId: number) => {
  const params = {
    currentPage: 1,
    pageSize: 10,
    table_id: tableId,
  };

  return httpClient.get<PageData<any>>(`/gen-table/data/${params.table_id}/${params.currentPage}/${params.pageSize}`)
};

export const fetchTableStructure = async (tableId: number) => {
  const params = {
    currentPage: 1,
    pageSize: 1000,
    table_id: tableId,
  };

  return httpClient.get<PageData<TableColumn>>('/field/fields', params).then((res) => {
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
export const fetchIndexStructure = async (tableId: number): Promise<TableIndex[]> => {
  const params = {
    currentPage: 1,
    pageSize: 1000,
    table_id: tableId,
  };
  return httpClient.get<PageData<TableIndex>>('/index/indexes', params).then((res) => {
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
