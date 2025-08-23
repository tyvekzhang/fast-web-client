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
  batchCreateDictTypes,
  batchDeleteDictType,
  createDictType,
  deleteDictType,
  exportDictType,
  importDictType,
  updateDictType,
  useDictType,
  useDictTypes,
} from '@/service/dict-type';
import { createPaginationRequest } from '@/types';
import {
  CreateDictType,
  DictType,
  ListDictTypesRequest,
  UpdateDictType,
} from '@/types/dict-type';
import { Form, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import CreateDictTypeComponent from './components/create-dict-type';
import DictTypeDetailComponent from './components/dict-type-detail';
import ImportDictTypeComponent from './components/import-dict-type';
import QueryDictTypeComponent from './components/query-dict-type';
import UpdateDictTypeComponent from './components/update-dict-type';

const DictTypePage: React.FC = () => {
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
  const [isQueryDictTypeShow, setIsQueryDictTypeShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryDictTypeForm] = Form.useForm();
  const [dictTypeQueryParams, setDictTypeQueryParams] =
    useState<ListDictTypesRequest>();

  // 用 useDictTypes 获取菜单列表数据
  const {
    dictTypes: dictTypeListDataSource,
    total,
    isLoading: isDictTypeListLoading,
    mutateDictTypes,
  } = useDictTypes({
    ...dictTypeQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryDictTypeShow = () => {
    setIsQueryDictTypeShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryDictTypeReset = () => {
    resetPagination();
    queryDictTypeForm.resetFields();
    mutateDictTypes();
  };

  const onQueryDictTypeFinish = async () => {
    const values = queryDictTypeForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryDictType = values as ListDictTypesRequest;
    const filteredQueryDictType = Object.fromEntries(
      Object.entries(queryDictType).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setDictTypeQueryParams(filteredQueryDictType as ListDictTypesRequest);
  };

  // 详情模块
  const [isDictTypeDetailDrawerVisible, setIsDictTypeDetailDrawerVisible] =
    useState(false);
  const [selectedDictTypeId, setSelectedDictTypeId] = useState<string | null>(
    null,
  );

  const { dictType: dictTypeDetail, isLoading: isDictTypeDetailLoading } =
    useDictType(selectedDictTypeId || '');

  const onDictTypeDetail = (dictType: DictType) => {
    setSelectedDictTypeId(dictType.id);
    setIsDictTypeDetailDrawerVisible(true);
  };

  const onDictTypeDetailClose = () => {
    setSelectedDictTypeId(null);
    setIsDictTypeDetailDrawerVisible(false);
  };

  // 表格列信息
  const dictTypeColumns: ColumnsType<DictType> = [
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
      render: (_: number, _record: DictType, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },

    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '-'),
      width: '16%',
      ellipsis: true,
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        if (text) {
          return (
            <a
              className={'text-blue-600'}
              href={`/system/dict-datum?type=${text}`}
            >
              {text}
            </a>
          );
        }
        return '-';
      },
      width: '16%',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (text ? text : '-'),
      width: '16%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string) =>
        text ? (
          <span>{format(new Date(text), 'yyyy-MM-dd HH:mm:ss')}</span>
        ) : (
          '-'
        ),
      width: '14%',
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
            onClick={() => onDictTypeDetail(record)}
          >
            <Eye className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateDictType(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteDictType(record)}
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
    dictTypeColumns.map((col) => col.key),
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
  const filteredDictTypeColumns = dictTypeColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateDictTypeModalVisible, setIsCreateDictTypeModalVisible] =
    useState(false);
  const [isCreateDictTypeLoading, setIsCreateDictTypeLoading] = useState(false);
  const [createDictTypeForm] = Form.useForm();

  const onCreateDictType = () => {
    setIsCreateDictTypeModalVisible(true);
  };
  const handleCreateDictTypeCancel = () => {
    createDictTypeForm.resetFields();
    setIsCreateDictTypeModalVisible(false);
  };
  const handleCreateDictTypeFinish = async (data: CreateDictType) => {
    setIsCreateDictTypeLoading(true);
    try {
      await createDictType({ dictType: data });
      message.success('新增成功');
      createDictTypeForm.resetFields();
      setIsCreateDictTypeModalVisible(false);
      mutateDictTypes();
    } finally {
      setIsCreateDictTypeLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteDictType = async (dictType: DictType) => {
    await deleteDictType(dictType.id);
    message.success('删除成功');
    mutateDictTypes();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DictType[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DictType[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleDictTypeBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteDictType({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateDictTypes();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleDictTypeBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateDictTypeModalVisible, setIsUpdateDictTypeModalVisible] =
    useState<boolean>(false);
  const [isUpdateDictTypeLoading, setIsUpdateDictTypeLoading] =
    useState<boolean>(false);
  const [updateDictTypeForm] = Form.useForm();

  const onUpdateDictType = (dictType: DictType) => {
    setIsUpdateDictTypeModalVisible(true);
    setSelectedRowKeys([dictType.id]);
    setSelectedRows([dictType]);
    updateDictTypeForm.setFieldsValue({ ...dictType });
  };

  const handleUpdateDictTypeCancel = () => {
    resetSelectedRows();
    updateDictTypeForm.resetFields();
    setIsUpdateDictTypeModalVisible(false);
  };

  const handleUpdateDictTypeFinish = async () => {
    const updateDictTypeData =
      (await updateDictTypeForm.validateFields()) as UpdateDictType;
    const req = { ...updateDictTypeData, id: selectedRows[0].id };
    setIsUpdateDictTypeLoading(true);
    try {
      await updateDictType({ dictType: req });
      updateDictTypeForm.resetFields();
      message.success('更新成功');
      mutateDictTypes();
      resetSelectedRows();
    } finally {
      setIsUpdateDictTypeLoading(false);
      setIsUpdateDictTypeModalVisible(false);
    }
  };

  // 导入模块
  const [isImportDictTypeModalVisible, setIsImportDictTypeModalVisible] =
    useState<boolean>(false);
  const [isImportDictTypeLoading, setIsImportDictTypeLoading] =
    useState<boolean>(false);
  const [createDictTypeList, setCreateDictTypeList] = useState<
    CreateDictType[]
  >([]);

  const onImportDictType = () => {
    setIsImportDictTypeModalVisible(true);
  };

  const handleImportDictTypeCancel = () => {
    setIsImportDictTypeModalVisible(false);
  };

  const onImportDictTypeFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportDictTypeLoading(true);
      const createDictTypeList = await importDictType({ file: fileList[0] });
      setCreateDictTypeList(createDictTypeList.dictTypes);
      return createDictTypeList;
    } finally {
      setIsImportDictTypeLoading(false);
    }
  };

  const handleImportDictType = async () => {
    setIsImportDictTypeLoading(true);
    try {
      await batchCreateDictTypes({ dictTypes: createDictTypeList });
      message.success('导入成功');
      setIsImportDictTypeModalVisible(false);
      mutateDictTypes();
    } finally {
      setIsImportDictTypeLoading(false);
      setCreateDictTypeList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onDictTypeExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportDictType({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryDictTypeShow}>
        <QueryDictTypeComponent
          onQueryDictTypeFinish={onQueryDictTypeFinish}
          onQueryDictTypeReset={handleQueryDictTypeReset}
          onQueryDictTypeForm={queryDictTypeForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateDictType}
          onImport={onImportDictType}
          onExport={onDictTypeExport}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleDictTypeBatchRemove}
          onConfirmBatchRemoveCancel={handleDictTypeBatchRemoveCancel}
          isQueryShow={isQueryDictTypeShow}
          onQueryShow={onQueryDictTypeShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={dictTypeColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<DictType>
          columns={filteredDictTypeColumns}
          dataSource={dictTypeListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isDictTypeListLoading}
        />
      </div>
      <div>
        <div>
          <CreateDictTypeComponent
            isCreateDictTypeModalVisible={isCreateDictTypeModalVisible}
            onCreateDictTypeCancel={handleCreateDictTypeCancel}
            onCreateDictTypeFinish={handleCreateDictTypeFinish}
            isCreateDictTypeLoading={isCreateDictTypeLoading}
            createDictTypeForm={createDictTypeForm}
            treeSelectDataSource={dictTypeListDataSource}
          />
        </div>
        <div>
          <DictTypeDetailComponent
            isDictTypeDetailDrawerVisible={isDictTypeDetailDrawerVisible}
            onDictTypeDetailClose={onDictTypeDetailClose}
            dictTypeDetail={dictTypeDetail}
            loading={isDictTypeDetailLoading}
          />
        </div>
        <div>
          <UpdateDictTypeComponent
            isUpdateDictTypeModalVisible={isUpdateDictTypeModalVisible}
            onUpdateDictTypeCancel={handleUpdateDictTypeCancel}
            onUpdateDictTypeFinish={handleUpdateDictTypeFinish}
            isUpdateDictTypeLoading={isUpdateDictTypeLoading}
            updateDictTypeForm={updateDictTypeForm}
            treeSelectDataSource={dictTypeListDataSource}
          />
        </div>
        <div>
          <ImportDictTypeComponent
            isImportDictTypeModalVisible={isImportDictTypeModalVisible}
            isImportDictTypeLoading={isImportDictTypeLoading}
            onImportDictTypeFinish={onImportDictTypeFinish}
            onImportDictTypeCancel={handleImportDictTypeCancel}
            handleImportDictType={handleImportDictType}
          />
        </div>
      </div>
    </div>
  );
};

export default DictTypePage;
