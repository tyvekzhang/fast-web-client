import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  RoleBatchModify,
  RoleCreate,
  RoleDetail,
  RoleModify,
  RolePage,
  RoleQuery,
} from '@/types/role';
import { AxiosResponse } from 'axios';

/**
 * 分页查询Role
 *
 * @param pageQuery 分页参数
 * @param roleQuery 查询条件
 * @returns 含Role详情列表的分页结果
 */
export function fetchRoleByPage(
  pageQuery?: PageQuery,
  roleQuery?: Partial<RoleQuery>,
) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...roleQuery,
  };
  return httpClient.get<PageResult<RolePage>>('/role/page', params);
}

/**
 * 获取Role详情
 *
 * @param id Role的ID
 * @returns Role详细信息
 */
export function fetchRoleDetail(id: string) {
  return httpClient.get<RoleDetail>(`/role/detail/${id}`);
}

/**
 * 导出Role数据导入模板
 *
 */
export async function exportRoleTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/role/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '角色信息导入模板.xlsx');
}

/**
 * 导出Role数据
 *
 * @param ids 要导出的Role的ID列表
 */
export async function exportRolePage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/role/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '角色信息导出.xlsx');
}

/**
 * 创建Role
 *
 * @param roleCreate 创建数据
 * @returns 创建的Role的ID
 */
export function createRole(roleCreate: RoleCreate) {
  return httpClient.post<number>('/role/create', roleCreate);
}

/**
 * 导入Role数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importRole(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<RoleCreate[]>('/role/import', formData);
}

/**
 * 批量创建Role
 *
 * @param roleCreateList 创建数据列表
 * @returns 创建的Role的ID列表
 */
export function batchCreateRole(roleCreateList: RoleCreate[]) {
  if (!roleCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/role/batch-create', roleCreateList);
}

/**
 * 移除Role
 *
 * @param id 要移除的Role的Id
 */
export function removeRole(id: string) {
  return httpClient.delete<void>(`/role/remove/${id}`);
}

/**
 * 批量移除Role
 *
 * @param ids 要移除的Role的ID数组
 */
export function batchRemoveRole(ids: string[]) {
  return httpClient.delete<void>('/role/batch-remove', { ids: ids });
}

/**
 * 更新Role信息
 *
 * @param roleModify 包含ID数组和修改的数据
 */
export function modifyRole(roleModify: RoleModify) {
  return httpClient.put<void>('/role/modify', roleModify);
}

/**
 * 批量更新Role信息
 *
 * @param roleBatchModify 包含ID数组和修改的数据
 */
export function batchModifyRole(roleBatchModify: RoleBatchModify) {
  return httpClient.put<void>('/role/batch-modify', roleBatchModify);
}
