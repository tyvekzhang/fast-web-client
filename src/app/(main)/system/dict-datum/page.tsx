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
'use client';
import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import {
  batchCreateDictData,
  batchDeleteDictDatum,
  createDictDatum,
  deleteDictDatum,
  exportDictDatum,
  importDictDatum,
  updateDictDatum,
  useDictData,
  useDictDatum,
} from '@/service/dict-datum';
import { createPaginationRequest } from '@/types';
import {
  CreateDictDatum,
  DictDatum,
  ListDictDataRequest,
  UpdateDictDatum,
} from '@/types/dict-datum';
import { Form, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import CreateDictDatumComponent from './components/create-dict-datum';
import DictDatumDetailComponent from './components/dict-datum-detail';
import ImportDictDatumComponent from './components/import-dict-datum';
import QueryDictDatumComponent from './components/query-dict-datum';
import UpdateDictDatumComponent from './components/update-dict-datum';

const DictDatumPage: React.FC = () => {
  // 配置模块
  const actionConfig = {
    showCreate: true,
    showImport: true,
    showExport: true,
    showModify: false,
    showRemove: true,
  };
  const showMore = false;

  // 查询模块
  const [isQueryDictDatumShow, setIsQueryDictDatumShow] =
    useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryDictDatumForm] = Form.useForm();
  const [createDictDatumForm] = Form.useForm();
  const searchParams = useSearchParams();
  const [dictType, setDictType] = useState(searchParams.get('type'));
  createDictDatumForm.setFieldValue('type', dictType);
  queryDictDatumForm.setFieldValue('type', dictType);
  const router = useRouter();
  if (dictType === null || dictType === undefined) {
    router.push('/system/dict-type');
  }
  const initRequestData: ListDictDataRequest = {
    current: 1,
    page_size: 10,
    type: dictType || '',
  };
  const [dictDatumQueryParams, setDictDatumQueryParams] =
    useState<ListDictDataRequest>(initRequestData);

  // 用 useDictData 获取菜单列表数据
  const {
    dictData: dictDatumListDataSource,
    total,
    isLoading: isDictDatumListLoading,
    mutateDictData,
  } = useDictData({
    ...dictDatumQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryDictDatumShow = () => {
    setIsQueryDictDatumShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryDictDatumReset = () => {
    resetPagination();
    queryDictDatumForm.resetFields();
    mutateDictData();
  };

  const onQueryDictDatumFinish = async () => {
    const values = queryDictDatumForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryDictDatum = values as ListDictDataRequest;
    const filteredQueryDictDatum = Object.fromEntries(
      Object.entries(queryDictDatum).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setDictDatumQueryParams(filteredQueryDictDatum as ListDictDataRequest);
  };

  // 详情模块
  const [isDictDatumDetailDrawerVisible, setIsDictDatumDetailDrawerVisible] =
    useState(false);
  const [selectedDictDatumId, setSelectedDictDatumId] = useState<string | null>(
    null,
  );

  const { dictDatum: dictDatumDetail, isLoading: isDictDatumDetailLoading } =
    useDictDatum(selectedDictDatumId || '');

  const onDictDatumDetail = (dictDatum: DictDatum) => {
    setSelectedDictDatumId(dictDatum.id);
    setIsDictDatumDetailDrawerVisible(true);
  };

  const onDictDatumDetailClose = () => {
    setSelectedDictDatumId(null);
    setIsDictDatumDetailDrawerVisible(false);
  };

  // 表格列信息
  const dictDatumColumns: ColumnsType<DictDatum> = [
    {
      title: '主键',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: DictDatum, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '字典键',
      dataIndex: 'value',
      key: 'value',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      key: 'label',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string) =>
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span> : '-',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateDictDatum(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteDictDatum(record)}
            okText="确认"
            cancelText="取消"
          >
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-remove"
            >
              <Trash2 className="w-3 h-3" />
              删除
            </button>
          </Popconfirm>

          {showMore && (
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-operation"
            >
              <span>更多</span>
              <MoreHorizontal className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    dictDatumColumns.map((col) => col.key),
  );
  const onToggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter((key) => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredDictDatumColumns = dictDatumColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateDictDatumModalVisible, setIsCreateDictDatumModalVisible] =
    useState(false);
  const [isCreateDictDatumLoading, setIsCreateDictDatumLoading] =
    useState(false);

  const onDictTypeChange = (value: string) => {
    setDictType(value);
    createDictDatumForm.setFieldValue('type', value);
  };

  const onCreateDictDatum = () => {
    setIsCreateDictDatumModalVisible(true);
  };
  const handleCreateDictDatumCancel = () => {
    createDictDatumForm.resetFields();
    setIsCreateDictDatumModalVisible(false);
  };
  const handleCreateDictDatumFinish = async (data: CreateDictDatum) => {
    setIsCreateDictDatumLoading(true);
    try {
      await createDictDatum({ dictDatum: data });
      message.success('新增成功');
      createDictDatumForm.resetFields();
      setIsCreateDictDatumModalVisible(false);
      mutateDictData();
    } finally {
      setIsCreateDictDatumLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteDictDatum = async (dictDatum: DictDatum) => {
    await deleteDictDatum(dictDatum.id);
    message.success('删除成功');
    mutateDictData();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DictDatum[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DictDatum[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleDictDatumBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteDictDatum({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateDictData();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleDictDatumBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateDictDatumModalVisible, setIsUpdateDictDatumModalVisible] =
    useState<boolean>(false);
  const [isUpdateDictDatumLoading, setIsUpdateDictDatumLoading] =
    useState<boolean>(false);
  const [updateDictDatumForm] = Form.useForm();

  const onUpdateDictDatum = (dictDatum: DictDatum) => {
    setIsUpdateDictDatumModalVisible(true);
    setSelectedRowKeys([dictDatum.id]);
    setSelectedRows([dictDatum]);
    updateDictDatumForm.setFieldsValue({ ...dictDatum });
  };

  const handleUpdateDictDatumCancel = () => {
    resetSelectedRows();
    updateDictDatumForm.resetFields();
    setIsUpdateDictDatumModalVisible(false);
  };

  const handleUpdateDictDatumFinish = async () => {
    const updateDictDatumData =
      (await updateDictDatumForm.validateFields()) as UpdateDictDatum;
    const req = { ...updateDictDatumData, id: selectedRows[0].id };
    setIsUpdateDictDatumLoading(true);
    try {
      await updateDictDatum({ dictDatum: req });
      updateDictDatumForm.resetFields();
      message.success('更新成功');
      mutateDictData();
      resetSelectedRows();
    } finally {
      setIsUpdateDictDatumLoading(false);
      setIsUpdateDictDatumModalVisible(false);
    }
  };

  // 导入模块
  const [isImportDictDatumModalVisible, setIsImportDictDatumModalVisible] =
    useState<boolean>(false);
  const [isImportDictDatumLoading, setIsImportDictDatumLoading] =
    useState<boolean>(false);
  const [createDictDatumList, setCreateDictDatumList] = useState<
    CreateDictDatum[]
  >([]);

  const onImportDictDatum = () => {
    setIsImportDictDatumModalVisible(true);
  };

  const handleImportDictDatumCancel = () => {
    setIsImportDictDatumModalVisible(false);
  };

  const onImportDictDatumFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportDictDatumLoading(true);
      const createDictDatumList = await importDictDatum({ file: fileList[0] });
      setCreateDictDatumList(createDictDatumList.dictData);
      return createDictDatumList;
    } finally {
      setIsImportDictDatumLoading(false);
    }
  };

  const handleImportDictDatum = async () => {
    setIsImportDictDatumLoading(true);
    try {
      await batchCreateDictData({ dictData: createDictDatumList });
      message.success('导入成功');
      setIsImportDictDatumModalVisible(false);
      mutateDictData();
    } finally {
      setIsImportDictDatumLoading(false);
      setCreateDictDatumList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onDictDatumExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportDictDatum({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryDictDatumShow}>
        <QueryDictDatumComponent
          onQueryDictDatumFinish={onQueryDictDatumFinish}
          onQueryDictDatumReset={handleQueryDictDatumReset}
          onQueryDictDatumForm={queryDictDatumForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateDictDatum}
          onImport={onImportDictDatum}
          onExport={onDictDatumExport}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleDictDatumBatchRemove}
          onConfirmBatchRemoveCancel={handleDictDatumBatchRemoveCancel}
          isQueryShow={isQueryDictDatumShow}
          onQueryShow={onQueryDictDatumShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={dictDatumColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<DictDatum>
          columns={filteredDictDatumColumns}
          dataSource={dictDatumListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isDictDatumListLoading}
        />
      </div>
      <div>
        <div>
          <CreateDictDatumComponent
            isCreateDictDatumModalVisible={isCreateDictDatumModalVisible}
            onCreateDictDatumCancel={handleCreateDictDatumCancel}
            onCreateDictDatumFinish={handleCreateDictDatumFinish}
            isCreateDictDatumLoading={isCreateDictDatumLoading}
            createDictDatumForm={createDictDatumForm}
            treeSelectDataSource={dictDatumListDataSource}
          />
        </div>
        <div>
          <DictDatumDetailComponent
            isDictDatumDetailDrawerVisible={isDictDatumDetailDrawerVisible}
            onDictDatumDetailClose={onDictDatumDetailClose}
            dictDatumDetail={dictDatumDetail}
            loading={isDictDatumDetailLoading}
          />
        </div>
        <div>
          <UpdateDictDatumComponent
            isUpdateDictDatumModalVisible={isUpdateDictDatumModalVisible}
            onUpdateDictDatumCancel={handleUpdateDictDatumCancel}
            onUpdateDictDatumFinish={handleUpdateDictDatumFinish}
            isUpdateDictDatumLoading={isUpdateDictDatumLoading}
            updateDictDatumForm={updateDictDatumForm}
            treeSelectDataSource={dictDatumListDataSource}
          />
        </div>
        <div>
          <ImportDictDatumComponent
            isImportDictDatumModalVisible={isImportDictDatumModalVisible}
            isImportDictDatumLoading={isImportDictDatumLoading}
            onImportDictDatumFinish={onImportDictDatumFinish}
            onImportDictDatumCancel={handleImportDictDatumCancel}
            handleImportDictDatum={handleImportDictDatum}
          />
        </div>
      </div>
    </div>
  );
};

export default DictDatumPage;
