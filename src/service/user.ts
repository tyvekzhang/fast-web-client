import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { UserInfo } from '@/types';
import { AppMenu } from '@/types/menu';
import {
  LoginForm,
  Token,
  UserAdd,
  UserBatchModify,
  UserQuery,
  UserQueryForm,
  UserTableData,
} from '@/types/user';
import { AxiosResponse } from 'axios';
import { RcFile } from 'rc-upload/lib/interface';

export function userAdd(data: UserAdd) {
  return httpClient.post('/v1/user/add', data);
}

export function login(data: LoginForm) {
  return httpClient.post<Token>('/v1/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function refreshToken(data: Token) {
  return httpClient.post<Token>('/v1/user/refreshtoken', {
    refresh_token: data.refresh_token,
  });
}

export function me(): Promise<UserInfo | null> {
  return httpClient.get('/v1/user/me');
}

export async function userExportTemplate(
  fileName: string = 'user_import_template.xlsx',
) {
  const response = await httpClient.get<AxiosResponse>(
    '/v1/user/exportTemplate',
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
  return httpClient.post('/v1/user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function users(userFilterForm: UserQueryForm) {
  return httpClient.get<UserTableData>('/v1/user/page', userFilterForm);
}

export async function userExport(
  userFilterForm: UserQueryForm,
  fileName: string = 'users.xlsx',
) {
  try {
    const response = await httpClient.get<AxiosResponse>(
      '/v1/user/export',
      userFilterForm,
      {
        responseType: 'blob',
      },
    );
    downloadBlob(response, fileName);
  } catch (error) {
    console.error(error);
  }
}

export function userModify(data: UserQuery) {
  return httpClient.put<UserQuery>('/v1/user/modify', data);
}

export function userBatchModify(
  ids_data: number[],
  user_batch_modify_data: UserBatchModify,
) {
  return httpClient.put('/v1/user/batchmodify', {
    ids: { ids: ids_data },
    data: user_batch_modify_data,
  });
}

export function userRemove(data: UserQuery) {
  return httpClient.delete(`/v1/user/remove/${data.id}`);
}

export function userRecover(data: UserQuery) {
  return httpClient.post(`/v1/user/recover`, data);
}

export function userBatchRemove(ids: number[]) {
  return httpClient.delete(`/v1/user/batchremove`, { ids: ids });
}

export function logout() {
  return httpClient.post('/v1/user/logout');
}

export function userMenus() {
  return httpClient.get<AppMenu[]>('/v1/user/menus');
}
