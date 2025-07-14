import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  MenuBatchModify,
  MenuCreate,
  MenuDetail,
  MenuModify,
  MenuPage,
  MenuQuery,
} from '@/types/menu';
import { AxiosResponse } from 'axios';

/**
 * 分页查询Menu
 *
 * @param pageQuery 分页参数
 * @param menuQuery 查询条件
 * @returns 含Menu详情列表的分页结果
 */
export function fetchMenuByPage(
  pageQuery?: PageQuery,
  menuQuery?: Partial<MenuQuery>,
) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...menuQuery,
  };
  return httpClient.get<PageResult<MenuPage>>('/menus', params);
}

/**
 * 获取Menu详情
 *
 * @param id Menu的ID
 * @returns Menu详细信息
 */
export function fetchMenuDetail(id: string) {
  return httpClient.get<MenuDetail>(`/menu/detail/${id}`);
}

/**
 * 导出Menu数据导入模板
 *
 */
export async function exportMenuTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/menu/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '系统菜单导入模板.xlsx');
}

/**
 * 导出Menu数据
 *
 * @param ids 要导出的Menu的ID列表
 */
export async function exportMenuPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/menu/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '系统菜单导出.xlsx');
}

/**
 * 创建Menu
 *
 * @param menuCreate 创建数据
 * @returns 创建的Menu的ID
 */
export function createMenu(menuCreate: MenuCreate) {
  return httpClient.post<number>('/menu/create', menuCreate);
}

/**
 * 导入Menu数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importMenu(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<MenuCreate[]>('/menu/import', formData);
}

/**
 * 批量创建Menu
 *
 * @param menuCreateList 创建数据列表
 * @returns 创建的Menu的ID列表
 */
export function batchCreateMenu(menuCreateList: MenuCreate[]) {
  if (!menuCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/menu/batch-create', menuCreateList);
}

/**
 * 移除Menu
 *
 * @param id 要移除的Menu的Id
 */
export function removeMenu(id: string) {
  return httpClient.delete<void>(`/menu/remove/${id}`);
}

/**
 * 批量移除Menu
 *
 * @param ids 要移除的Menu的ID数组
 */
export function batchRemoveMenu(ids: string[]) {
  return httpClient.delete<void>('/menu/batch-remove', { ids: ids });
}

/**
 * 更新Menu信息
 *
 * @param menuModify 包含ID数组和修改的数据
 */
export function modifyMenu(menuModify: MenuModify) {
  return httpClient.put<void>('/menu/modify', menuModify);
}

/**
 * 批量更新Menu信息
 *
 * @param menuBatchModify 包含ID数组和修改的数据
 */
export function batchModifyMenu(menuBatchModify: MenuBatchModify) {
  return httpClient.put<void>('/menu/batch-modify', menuBatchModify);
}
