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
import httpClient, { fetcher } from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { PageResult } from '@/types';
import {
  BatchCreateUsersRequest,
  BatchDeleteUsersRequest,
  BatchUpdateUsersRequest,
  BatchUpdateUsersResponse,
  CreateUserRequest,
  ExportUsersRequest,
  ImportUsersRequest,
  ImportUsersResponse,
  ListUsersRequest,
  UpdateUserRequest,
  User,
  UserDetail,
} from '@/types/user';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

/**
 * Retrieve user details.
 *
 * @param ID of the user resource.
 * @returns The user object containing all its details.
 */
export function useUser(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserDetail>(
    id ? `/users/${id}` : null,
    fetcher,
  );

  return {
    user: data,
    isLoading,
    isError: error,
    isValidating,
    mutateMenu: mutate,
  };
}

/**
 * List users with pagination.
 *
 * @param req Request object containing pagination, filter and sort parameters.
 * @returns Paginated list of users and total count.
 */
export function useUsers(req: Partial<ListUsersRequest>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PageResult<User>
  >(['/users', req], ([url, params]) => fetcher(url, params));

  return {
    users: data?.records,
    total: data?.total,
    isLoading,
    isError: error,
    isValidating,
    mutateUsers: mutate,
  };
}

/**
 * Create a new user.
 *
 * @param req Request object containing user creation data.
 * @returns The user object.
 */
export function createUser(req: CreateUserRequest) {
  return httpClient.post<number>('/users', req);
}

/**
 * Update an existing user.
 *
 * @param req Request object containing user update data.
 */
export function updateUser(req: UpdateUserRequest) {
  return httpClient.put<User>('/users', req);
}

/**
 * Delete user by ID
 *
 * @param id The ID of the user to delete.
 */
export function deleteUser(id: string) {
  return httpClient.delete<void>(`/users/${id}`);
}

/**
 *  Batch create users.
 *
 * @param req Request body containing a list of user creation items.
 * @returns Response containing the list of created users.
 */
export function batchCreateUsers(req: BatchCreateUsersRequest) {
  return httpClient.post<number[]>('/users:batchCreate', req);
}

/**
 * Batch updates multiple users in a single operation.
 *
 * @param req The batch update request data.
 */
export function batchUpdateUsers(req: BatchUpdateUsersRequest) {
  return httpClient.put<BatchUpdateUsersResponse>('/user:batchUpdate', req);
}

/**
 * Batch delete users.
 *
 * @param req Request object containing delete info.
 */
export function batchDeleteUser(req: BatchDeleteUsersRequest) {
  return httpClient.delete<void>('/users:batchDelete', { data: req });
}

/**
 *  Export the Excel template for user import.
 *
 */
export async function exportUserTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/users:exportTemplate`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'user_import_tpl.xlsx');
}

/**
 * Export user data based on the provided user IDs.
 *
 * @param req Query parameters specifying the users to export.
 */
export async function exportUser(req: ExportUsersRequest) {
  const params = {
    ids: req.ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/users:export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, 'user_data_export.xlsx');
}

/**
 * Import users from an uploaded Excel file.
 *
 * @param req The request with file to import.
 * @returns  List of successfully parsed user data.
 */
export function importUser(req: ImportUsersRequest) {
  const formData = new FormData();
  formData.append('file', req.file);
  return httpClient.post<ImportUsersResponse>('/users:import', formData);
}
