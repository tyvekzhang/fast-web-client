import { PaginationRequest } from '@/types/index';

export interface ListConnectionsRequest {}

export interface Connection {
  id: number;
  connection_name: string;
}

export interface DatabaseConnection {
  id: number;
  connection_name: string;
}

export interface ListDatabasesRequest extends PaginationRequest {
  database_name?: string;
  connection_id?: number;
}

export interface Database {
  id: number;
  database_name: string;
}

export interface TableInfo {
  id: number;
  name: string;
  database_id: number;
  comment?: string;
  create_time?: number;
}

export interface TableColumn {
  id?: number;
  key: string;
  name: string;
  type: string | undefined;
  length?: number;
  scale?: number;
  default: string;
  comment: string;
  nullable: boolean;
  primary_key: boolean;
  autoincrement: boolean;
  sort: number;
}

export interface TableIndex {
  key: string;
  name: string;
  type: string;
  field: string;
  comment?: string;
}

export interface TableMetadata {
  table_name: string;
  comment?: string;
}

export interface TableAdd {
  tableName: string;
  databaseId: number;
}

export interface ConnectionCreate {
  connection_name: string;
  database_type: string;
  connection_database?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
}

export interface ConnectionQueryResponse {
  id: number; // 连接 ID
  connection_name: string; // 连接名称
  database_type: string; // 数据库类型
}

export interface SQLSchema {
  connection_id: number; // 数据库连接id
  database_name: string; // 数据库名称
  owner?: string; // 拥有者
  template?: string; // 使用模板
  encoding?: string; // 字符编码
  collation_order?: string; // 排序规则
  character_classification?: string; // 字符分类
  tablespace?: string; // 表空间名称
  connection_limit?: number; // 连接限制
  allow_connection?: boolean; // 是否允许连接
  is_template?: boolean; // 是否为模板数据库
}

export interface GenTableExecute {
  database_id: number;
  sql_statement: string;
}
