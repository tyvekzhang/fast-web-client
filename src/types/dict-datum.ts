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

export interface ListDictDataRequest extends PaginationRequest {
  label?: string;

  value?: string;

  type: string;
}

export interface DictDataOptionItem {
  label?: string;
  value?: string;
}

export interface DictDataOption {
  options: Record<string, DictDataOptionItem[]>;
}

export interface DictDatum {
  id: string;

  sort: number;

  label: string;

  value: string;

  type: string;

  echo_style: string;

  ext_class: string;

  is_default: number;

  status: number;

  comment: string;

  create_time: string;
}

export interface DictDatumDetail extends DictDatum {}

export interface CreateDictDatum {
  sort: number;

  label: string;

  value: string;

  type: string;

  echo_style: string;

  ext_class: string;

  is_default: number;

  status: number;

  comment: string;
}

export interface CreateDictDatumRequest {
  dictDatum: CreateDictDatum;
}

export interface UpdateDictDatum {
  id: string;

  sort: number;

  label: string;

  value: string;

  type: string;

  echo_style: string;

  ext_class: string;

  is_default: number;

  status: number;

  comment: string;
}

export interface UpdateDictDatumRequest {
  dictDatum: UpdateDictDatum;
}

export interface BatchGetDictDataResponse {
  dictData: DictDatumDetail[];
}

export interface BatchCreateDictDataRequest {
  dictData: CreateDictDatum[];
}

export interface BatchCreateDictDatumResponse {
  dictData: DictDatum[];
}

export interface BatchUpdateDictDatum {
  sort: number;

  echo_style: string;

  ext_class: string;
}

export interface BatchUpdateDictDataRequest {
  ids: string[];
  dictDatum: BatchUpdateDictDatum;
}

export interface BatchPatchDictDataRequest {
  dictData: UpdateDictDatum[];
}

export interface BatchUpdateDictDataResponse {
  dictData: DictDatum[];
}

export interface BatchDeleteDictDataRequest {
  ids: string[];
}

export interface ExportDictDatum extends DictDatum {}

export interface ExportDictDataRequest {
  ids: string[];
}

export interface ImportDictDataRequest {
  file: File;
}

export interface ImportDictDatum extends CreateDictDatum {
  errMsg: string;
}

export interface ImportDictDataResponse {
  dictData: ImportDictDatum[];
}
