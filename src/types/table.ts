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
import { PaginationRequest } from '.';

export interface ListTablesRequest extends PaginationRequest {
  table_name: string;

  comment: string;
}

export interface Table {
  id: string;

  database_id: string;

  db_table_id: string;

  table_name: string;

  sub_table_name: string;

  sub_table_fk_name: string;

  class_name: string;

  backend: string;

  tpl_category: string;

  tpl_web_type: string;

  tpl_backend_type: string;

  package_name: string;

  module_name: string;

  business_name: string;

  function_name: string;

  function_author: string;

  gen_type: string;

  gen_path: string;

  options: string;

  comment: string;

  create_time: string;
}

export interface TableDetail extends Table {}

export interface CreateTable {
  database_id: string;

  db_table_id: string;

  table_name: string;

  sub_table_name: string;

  sub_table_fk_name: string;

  class_name: string;

  backend: string;

  tpl_category: string;

  tpl_web_type: string;

  tpl_backend_type: string;

  package_name: string;

  module_name: string;

  business_name: string;

  function_name: string;

  function_author: string;

  gen_type: string;

  gen_path: string;

  options: string;

  comment: string;
}

export interface CreateTableRequest {
  table: CreateTable;
}

export interface UpdateTable {
  id: string;

  database_id: string;

  db_table_id: string;

  table_name: string;

  sub_table_name: string;

  sub_table_fk_name: string;

  class_name: string;

  backend: string;

  tpl_category: string;

  tpl_web_type: string;

  tpl_backend_type: string;

  package_name: string;

  module_name: string;

  business_name: string;

  function_name: string;

  function_author: string;

  gen_type: string;

  gen_path: string;

  options: string;

  comment: string;
}

export interface UpdateTableRequest {
  table: UpdateTable;
}

export interface BatchGetTablesResponse {
  tables: TableDetail[];
}

export interface BatchCreateTablesRequest {
  tables: CreateTable[];
}

export interface BatchCreateTableResponse {
  tables: Table[];
}

export interface BatchUpdateTable {
  database_id: string;

  db_table_id: string;

  table_name: string;

  sub_table_name: string;

  sub_table_fk_name: string;

  class_name: string;

  backend: string;

  tpl_category: string;

  tpl_web_type: string;

  tpl_backend_type: string;

  package_name: string;

  module_name: string;

  business_name: string;

  function_name: string;

  function_author: string;

  gen_type: string;

  gen_path: string;

  options: string;

  comment: string;
}

export interface BatchUpdateTablesRequest {
  ids: string[];
  table: BatchUpdateTable;
}

export interface BatchPatchTablesRequest {
  tables: UpdateTable[];
}

export interface BatchUpdateTablesResponse {
  tables: Table[];
}

export interface BatchDeleteTablesRequest {
  ids: string[];
}

export interface ExportTable extends Table {}

export interface ExportTablesRequest {
  ids: string[];
}

export interface ImportTablesRequest {
  file: File;
}

export interface ImportTable extends CreateTable {
  errMsg: string;
}

export interface ImportTablesResponse {
  tables: ImportTable[];
}
