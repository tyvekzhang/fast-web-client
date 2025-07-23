import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { BaseQueryImpl, PaginationRequest, PageResult } from '@/types';
import {
  DictTypeBatchModify,
  DictTypeCreate,
  DictTypeDetail,
  DictTypeModify,
  DictTypePage,
  DictTypeQuery,
} from '@/types/dict-type';
import { AxiosResponse } from 'axios';

/**
 * 分页查询DictType
 *
 * @param pageQuery 分页参数
 * @param dictTypeQuery 查询条件
 * @returns 含DictType详情列表的分页结果
 */
export function fetchDictTypeByPage(
  pageQuery?: PaginationRequest,
  dictTypeQuery?: Partial<DictTypeQuery>,
) {
  let pageQueryParams: PaginationRequest;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...dictTypeQuery,
  };
  return httpClient.get<PageResult<DictTypePage>>('/dict-type/page', params);
}

/**
 * 获取DictType详情
 *
 * @param id DictType的ID
 * @returns DictType详细信息
 */
export function fetchDictTypeDetail(id: string) {
  return httpClient.get<DictTypeDetail>(`/dict-type/detail/${id}`);
}

/**
 * 导出DictType数据导入模板
 *
 */
export async function exportDictTypeTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/dict-type/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '字典类型导入模板.xlsx');
}

/**
 * 导出DictType数据
 *
 * @param ids 要导出的DictType的ID列表
 */
export async function exportDictTypePage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/dict-type/export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '字典类型导出.xlsx');
}

/**
 * 创建DictType
 *
 * @param dictTypeCreate 创建数据
 * @returns 创建的DictType的ID
 */
export function createDictType(dictTypeCreate: DictTypeCreate) {
  return httpClient.post<number>('/dict-type/create', dictTypeCreate);
}

/**
 * 导入DictType数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importDictType(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<DictTypeCreate[]>('/dict-type/import', formData);
}

/**
 * 批量创建DictType
 *
 * @param dictTypeCreateList 创建数据列表
 * @returns 创建的DictType的ID列表
 */
export function batchCreateDictType(dictTypeCreateList: DictTypeCreate[]) {
  if (!dictTypeCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>(
    '/dict-type/batch-create',
    dictTypeCreateList,
  );
}

/**
 * 移除DictType
 *
 * @param id 要移除的DictType的Id
 */
export function removeDictType(id: string) {
  return httpClient.delete<void>(`/dict-type/remove/${id}`);
}

/**
 * 批量移除DictType
 *
 * @param ids 要移除的DictType的ID数组
 */
export function batchRemoveDictType(ids: string[]) {
  return httpClient.delete<void>('/dict-type/batch-remove', { ids: ids });
}

/**
 * 更新DictType信息
 *
 * @param dictTypeModify 包含ID数组和修改的数据
 */
export function modifyDictType(dictTypeModify: DictTypeModify) {
  return httpClient.put<void>('/dict-type/modify', dictTypeModify);
}

/**
 * 批量更新DictType信息
 *
 * @param dictTypeBatchModify 包含ID数组和修改的数据
 */
export function batchModifyDictType(dictTypeBatchModify: DictTypeBatchModify) {
  return httpClient.put<void>('/dict-type/batch-modify', dictTypeBatchModify);
}
