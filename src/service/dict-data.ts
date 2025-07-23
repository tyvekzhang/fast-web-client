import httpClient from '@/lib/http';
import { downloadBlob } from '@/service/util';
import { BaseQueryImpl, PaginationRequest, PageResult } from '@/types';
import {
  DictDataBatchModify,
  DictDataCreate,
  DictDataDetail,
  DictDataModify,
  DictDataPage,
  DictDataQuery,
} from '@/types/dict-data';
import { AxiosResponse } from 'axios';

export function fetchAllDictData() {
  return httpClient.get<Record<number, any>>('/dict-data/all');
}
/**
 * 分页查询DictData
 *
 * @param pageQuery 分页参数
 * @param dictDataQuery 查询条件
 * @returns 含DictData详情列表的分页结果
 */
export function fetchDictDataByPage(
  pageQuery?: PaginationRequest,
  dictDataQuery?: Partial<DictDataQuery>,
) {
  let pageQueryParams: PaginationRequest;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...dictDataQuery,
  };
  return httpClient.get<PageResult<DictDataPage>>('/dict-data/page', params);
}

/**
 * 获取DictData详情
 *
 * @param id DictData的ID
 * @returns DictData详细信息
 */
export function fetchDictDataDetail(id: string) {
  return httpClient.get<DictDataDetail>(`/dict-data/detail/${id}`);
}

/**
 * 导出DictData数据导入模板
 *
 */
export async function exportDictDataTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/dict-data/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '字典数据导入模板.xlsx');
}

/**
 * 导出DictData数据
 *
 * @param ids 要导出的DictData的ID列表
 */
export async function exportDictDataPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(
    `/dict-data/export`,
    params,
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '字典数据导出.xlsx');
}

/**
 * 创建DictData
 *
 * @param dictDataCreate 创建数据
 * @returns 创建的DictData的ID
 */
export function createDictData(dictDataCreate: DictDataCreate) {
  return httpClient.post<number>('/dict-data/create', dictDataCreate);
}

/**
 * 导入DictData数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importDictData(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<DictDataCreate[]>('/dict-data/import', formData);
}

/**
 * 批量创建DictData
 *
 * @param dictDataCreateList 创建数据列表
 * @returns 创建的DictData的ID列表
 */
export function batchCreateDictData(dictDataCreateList: DictDataCreate[]) {
  if (!dictDataCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>(
    '/dict-data/batch-create',
    dictDataCreateList,
  );
}

/**
 * 移除DictData
 *
 * @param id 要移除的DictData的Id
 */
export function removeDictData(id: string) {
  return httpClient.delete<void>(`/dict-data/remove/${id}`);
}

/**
 * 批量移除DictData
 *
 * @param ids 要移除的DictData的ID数组
 */
export function batchRemoveDictData(ids: string[]) {
  return httpClient.delete<void>('/dict-data/batch-remove', { ids: ids });
}

/**
 * 更新DictData信息
 *
 * @param dictDataModify 包含ID数组和修改的数据
 */
export function modifyDictData(dictDataModify: DictDataModify) {
  return httpClient.put<void>('/dict-data/modify', dictDataModify);
}

/**
 * 批量更新DictData信息
 *
 * @param dictDataBatchModify 包含ID数组和修改的数据
 */
export function batchModifyDictData(dictDataBatchModify: DictDataBatchModify) {
  return httpClient.put<void>('/dict-data/batch-modify', dictDataBatchModify);
}
