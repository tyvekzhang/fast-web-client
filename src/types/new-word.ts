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

export interface ListNewWordsRequest extends PaginationRequest {
  id: string;

  word: string;

  translation: string;

  next_review_date: string;

  tenant: number;
}

export interface NewWord {
  id: string;

  word: string;

  translation: string;

  next_review_date: string;

  tenant: number;
}

export interface NewWordDetail extends NewWord {}

export interface CreateNewWord {
  word: string;

  translation: string;

  next_review_date: string;

  tenant: number;
}

export interface CreateNewWordRequest {
  newWord: CreateNewWord;
}

export interface UpdateNewWord {
  id: string;

  word: string;

  translation: string;

  next_review_date: string;

  tenant: number;
}

export interface UpdateNewWordRequest {
  newWord: UpdateNewWord;
}

export interface BatchGetNewWordsResponse {
  newWords: NewWordDetail[];
}

export interface BatchCreateNewWordsRequest {
  newWords: CreateNewWord[];
}

export interface BatchCreateNewWordResponse {
  newWords: NewWord[];
}

export interface BatchUpdateNewWord {
  word: string;

  translation: string;

  next_review_date: string;

  tenant: number;
}

export interface BatchUpdateNewWordsRequest {
  ids: string[];
  newWord: BatchUpdateNewWord;
}

export interface BatchPatchNewWordsRequest {
  newWords: UpdateNewWord[];
}

export interface BatchUpdateNewWordsResponse {
  newWords: NewWord[];
}

export interface BatchDeleteNewWordsRequest {
  ids: string[];
}

export interface ExportNewWord extends NewWord {}

export interface ExportNewWordsRequest {
  ids: string[];
}

export interface ImportNewWordsRequest {
  file: File;
}

export interface ImportNewWord extends CreateNewWord {
  errMsg: string;
}

export interface ImportNewWordsResponse {
  newWords: ImportNewWord[];
}
