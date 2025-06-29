import httpClient from '@/lib/http';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  UserRoleQuery,
  UserRoleCreate,
  UserRoleModify,
  UserRoleDetail,
  UserRolePage,
  UserRoleBatchModify,
} from '@/types/user-role';
import { AxiosResponse } from 'axios';
import { downloadBlob } from '@/service/util';
import { UserRoleAssign } from '@/types/user';

/**
 * 分页查询UserRole
 *
 * @param pageQuery 分页参数
 * @param userRoleQuery 查询条件
 * @returns 含UserRole详情列表的分页结果
 */
export function fetchUserRoleByPage(pageQuery?: PageQuery, userRoleQuery?: Partial<UserRoleQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery
  }
   const params = {
    ...pageQueryParams,
    ...userRoleQuery
  };
  return httpClient.get<PageResult<UserRolePage>>('/user-role/page', params);
}


/**
 * 获取UserRole详情
 *
 * @param id UserRole的ID
 * @returns UserRole详细信息
 */
export function fetchUserRoleDetail(id: string) {
  return httpClient.get<UserRoleDetail>(`/user-role/detail/${id}`);
}

/**
 * 导出UserRole数据导入模板
 *
 */
export async function exportUserRoleTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/user-role/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '用户和角色关联导入模板.xlsx');
}

/**
 * 导出UserRole数据
 *
 * @param ids 要导出的UserRole的ID列表
 */
export async function exportUserRolePage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/user-role/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '用户和角色关联导出.xlsx');
}

/**
 * 创建UserRole
 *
 * @param userRoleCreate 创建数据
 * @returns 创建的UserRole的ID
 */
export function createUserRole(userRoleCreate: UserRoleCreate) {
  return httpClient.post<number>('/user-role/create', userRoleCreate);
}

export function assignUserRole(userRoleAssign: UserRoleAssign) {
  return httpClient.post<number>('/user-role/assign', userRoleAssign);
}

/**
 * 导入UserRole数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importUserRole(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<UserRoleCreate[]>('/user-role/import', formData);
}

/**
 * 批量创建UserRole
 *
 * @param userRoleCreateList 创建数据列表
 * @returns 创建的UserRole的ID列表
 */
export function batchCreateUserRole(userRoleCreateList: UserRoleCreate[]) {
  if (!userRoleCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/user-role/batch-create', userRoleCreateList);
}

/**
 * 移除UserRole
 *
 * @param id 要移除的UserRole的Id
 */
export function removeUserRole(id: string) {
  return httpClient.delete<void>(`/user-role/remove/${id}`);
}

/**
 * 批量移除UserRole
 *
 * @param ids 要移除的UserRole的ID数组
 */
export function batchRemoveUserRole(ids: string[]) {
  return httpClient.delete<void>('/user-role/batch-remove', { ids: ids });
}

/**
 * 更新UserRole信息
 *
 * @param userRoleModify 包含ID数组和修改的数据
 */
export function modifyUserRole(userRoleModify: UserRoleModify) {
  return httpClient.put<void>('/user-role/modify', userRoleModify);
}

/**
 * 批量更新UserRole信息
 *
 * @param userRoleBatchModify 包含ID数组和修改的数据
 */
export function batchModifyUserRole(userRoleBatchModify: UserRoleBatchModify) {
  return httpClient.put<void>('/user-role/batch-modify', userRoleBatchModify);
}
