export interface CodePreviewResponse {
  backend: string;
  currentPage: string;
  converter: string;
  pageTs: string;
  queryTs: string;
  createTs: string;
  detailTs: string;
  updateTs: string;
  batchUpdateTs: string;
  importTs: string;
  serviceTs: string;
  typeTs: string;
  modelPy: string;
  schemaPy: string;
  mapperPy: string;
  servicePy: string;
  serviceImplPy: string;
  controllerPy: string;
}

export interface TableResponse {
  id: string;
  connectionName: string;
  databaseName: string;
  database_id?: string;
  tableId: string;
  tableName: string;
  entity: string;
  tableComment?: string;
  createTime: number;
}

export interface TableDataResponse {
  records: TableResponse[];
  total_count: number;
}

export interface GenTable {
  class_name: string;
  function_name: string;
  backend: string;
  function_author: string;
  tpl_category: string;
  gen_type: string;
  db_table_id: number;
  tpl_web_type: string;
  gen_path: string;
  id: number;
  tpl_backend_type: string;
  options: any | null;
  table_name: string;
  package_name: string;
  create_time: string;
  sub_table_name: string | null;
  module_name: string;
  update_time: string;
  sub_table_fk_name: string | null;
  business_name: string;
  comment: string;
}

export interface DbTable {
  database_id: number;
  comment: string;
  update_time: string;
  create_time: string;
  name: string;
  id: number;
}

export interface GenField {
  id: number;
  field_name: string;
  js_type: string;
  creatable: number;
  pageable: number;
  modifiable: number;
  query_type: string;
  dict_type: string | null;
  create_time: string;
  field_type: string;
  db_field_id: number;
  primary_key: number;
  queryable: number;
  detailable: number;
  batch_modifiable: number;
  html_type: string;
  comment: string;
  update_time: string;
}

export interface GenTableDetail {
  gen_table: GenTable;
  gen_field: GenField[];
}
