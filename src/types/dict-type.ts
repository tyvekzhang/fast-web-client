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

export interface ListDictTypesRequest extends PaginationRequest {
  id: string;

  name: string;

  type: string;

  status: number;

  create_time: string;
}

export interface DictType {
  id: string;

  name: string;

  type: string;

  status: number;

  comment: string;

  create_time: string;
}

export interface DictTypeDetail extends DictType {}

export interface CreateDictType {
  name: string;

  type: string;

  status: number;

  comment: string;
}

export interface CreateDictTypeRequest {
  dictType: CreateDictType;
}

export interface UpdateDictType {
  id: string;

  name: string;

  type: string;

  status: number;

  comment: string;
}

export interface UpdateDictTypeRequest {
  dictType: UpdateDictType;
}

export interface BatchGetDictTypesResponse {
  dictTypes: DictTypeDetail[];
}

export interface BatchCreateDictTypesRequest {
  dictTypes: CreateDictType[];
}

export interface BatchCreateDictTypeResponse {
  dictTypes: DictType[];
}

export interface BatchUpdateDictType {
  name: string;

  type: string;

  status: number;

  comment: string;
}

export interface BatchUpdateDictTypesRequest {
  ids: string[];
  dictType: BatchUpdateDictType;
}

export interface BatchPatchDictTypesRequest {
  dictTypes: UpdateDictType[];
}

export interface BatchUpdateDictTypesResponse {
  dictTypes: DictType[];
}

export interface BatchDeleteDictTypesRequest {
  ids: string[];
}

export interface ExportDictType extends DictType {}

export interface ExportDictTypesRequest {
  ids: string[];
}

export interface ImportDictTypesRequest {
  file: File;
}

export interface ImportDictType extends CreateDictType {
  errMsg: string;
}

export interface ImportDictTypesResponse {
  dictTypes: ImportDictType[];
}
