
import { downloadBlob } from '@/service/util';
import { UserInfo } from '@/types';
import { LoginForm, Token, UserAdd, UserBatchModify, UserQuery, UserQueryForm, UserTableData } from '@/types/user';
import httpClient from '@/lib/http';
import { AxiosResponse } from 'axios';
import { RcFile } from 'rc-upload/lib/interface';
import { AppMenu } from '@/types/menu';

export function userAdd(data: UserAdd) {
  return httpClient.post('/user/add', data);
}

export function login(data: LoginForm) {
  return httpClient.post<Token>('/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function refreshToken(data: Token) {
  return httpClient.post<Token>('/user/refreshtoken', {
    refresh_token: data.refresh_token,
  });
}

export function me(): Promise<UserInfo | null> {
  return httpClient.get('/user/me');
}

export async function userExportTemplate(fileName: string = 'user_import_template.xlsx') {
  const response = await httpClient.get<AxiosResponse>(
    '/user/exportTemplate',
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, fileName);
}

export function userImport(file: RcFile) {
  const formData = new FormData();

  formData.append('file', file);
  return httpClient.post('/user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function users(userFilterForm: UserQueryForm) {
  return httpClient.get<UserTableData>('/user/users', userFilterForm);
}

export async function userExport(userFilterForm: UserQueryForm, fileName: string = 'users.xlsx') {
  try {
    const response = await httpClient.get<AxiosResponse>('/user/export', userFilterForm, {
      responseType: 'blob',
    });
    downloadBlob(response, fileName);
  } catch (error) {
    console.error(error);
  }
}

export function userModify(data: UserQuery) {
  return httpClient.put<UserQuery>('/user/modify', data);
}

export function userBatchModify(ids_data: number[], user_batch_modify_data: UserBatchModify) {
  return httpClient.put('/user/batchmodify', {
    ids: { ids: ids_data },
    data: user_batch_modify_data,
  });
}

export function userRemove(data: UserQuery) {
  return httpClient.delete(`/user/remove/${data.id}`);
}

export function userRecover(data: UserQuery) {
  return httpClient.post(`/user/recover`, data);
}

export function userBatchRemove(ids: number[]) {
  return httpClient.delete(`/user/batchremove`, { ids: ids });
}

export function logout() {
  return httpClient.post('/user/logout');
}

export function userMenus() {
  return httpClient.get<AppMenu[]>('/user/menus');
}
