import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { BaseQueryImpl, PageResult, PaginationRequest } from '@/types';
import {
  RoleMenuBatchModify,
  RoleMenuCreate,
  RoleMenuDetail,
  RoleMenuModify,
  RoleMenuPage,
  RoleMenuQuery,
} from '@/types/role-menu';
import { AxiosResponse } from 'axios';

/**
 * 分页查询RoleMenu
 *
 * @param pageQuery 分页参数
 * @param roleMenuQuery 查询条件
 * @returns 含RoleMenu详情列表的分页结果
 */
export function fetchRoleMenuByPage(
  pageQuery?: PaginationRequest,
  roleMenuQuery?: Partial<RoleMenuQuery>,
) {
  let pageQueryParams: PaginationRequest;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...roleMenuQuery,
  };
  return httpClient.get<PageResult<RoleMenuPage>>('/role-menu/page', params);
}

/**
 * 获取RoleMenu详情
 *
 * @param id RoleMenu的ID
 * @returns RoleMenu详细信息
 */
export function fetchRoleMenuDetail(id: string) {
  return httpClient.get<RoleMenuDetail>(`/role-menu/detail/${id}`);
}

/**
 * 导出RoleMenu数据导入模板
 *
 */
export async function exportRoleMenuTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/role-menu/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '角色和菜单关联导入模板.xlsx');
}

/**
 * 导出RoleMenu数据
 *
 * @param ids 要导出的RoleMenu的ID列表
 */
export async function exportRoleMenuPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/role-menu/export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '角色和菜单关联导出.xlsx');
}

/**
 * 创建RoleMenu
 *
 * @param roleMenuCreate 创建数据
 * @returns 创建的RoleMenu的ID
 */
export function createRoleMenu(roleMenuCreate: RoleMenuCreate) {
  return httpClient.post<number>('/role-menu/create', roleMenuCreate);
}

/**
 * 导入RoleMenu数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importRoleMenu(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<RoleMenuCreate[]>('/role-menu/import', formData);
}

/**
 * 批量创建RoleMenu
 *
 * @param roleMenuCreateList 创建数据列表
 * @returns 创建的RoleMenu的ID列表
 */
export function batchCreateRoleMenu(roleMenuCreateList: RoleMenuCreate[]) {
  if (!roleMenuCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>(
    '/role-menu/batch-create',
    roleMenuCreateList,
  );
}

/**
 * 移除RoleMenu
 *
 * @param id 要移除的RoleMenu的Id
 */
export function removeRoleMenu(id: string) {
  return httpClient.delete<void>(`/role-menu/remove/${id}`);
}

/**
 * 批量移除RoleMenu
 *
 * @param ids 要移除的RoleMenu的ID数组
 */
export function batchRemoveRoleMenu(ids: string[]) {
  return httpClient.delete<void>('/role-menu/batch-remove', { ids: ids });
}

/**
 * 更新RoleMenu信息
 *
 * @param roleMenuModify 包含ID数组和修改的数据
 */
export function modifyRoleMenu(roleMenuModify: RoleMenuModify) {
  return httpClient.put<void>('/role-menu/modify', roleMenuModify);
}

/**
 * 批量更新RoleMenu信息
 *
 * @param roleMenuBatchModify 包含ID数组和修改的数据
 */
export function batchModifyRoleMenu(roleMenuBatchModify: RoleMenuBatchModify) {
  return httpClient.put<void>('/role-menu/batch-modify', roleMenuBatchModify);
}
