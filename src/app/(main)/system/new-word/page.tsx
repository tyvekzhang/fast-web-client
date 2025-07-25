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
  batchCreateNewWords,
  batchDeleteNewWord,
  batchUpdateNewWords,
  createNewWord,
  deleteNewWord,
  exportNewWord,
  getNewWord,
  importNewWord,
  listNewWords,
  updateNewWord,
} from '@/service/new-word';
import { BaseQueryImpl } from '@/types';
import {
  BatchUpdateNewWord,
  CreateNewWord,
  ListNewWordsRequest,
  NewWord,
  NewWordDetail,
  UpdateNewWord,
} from '@/types/new-word';
import { Form, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import BatchUpdateNewWordComponent from './components/batch-update-new-word';
import CreateNewWordComponent from './components/create-new-word';
import ImportNewWordComponent from './components/import-new-word';
import NewWordDetailComponent from './components/new-word-detail';
import NewWordQueryComponent from './components/query-new-word';
import UpdateNewWordComponent from './components/update-new-word';

const NewWordPage: React.FC = () => {
  // 配置模块
  const actionConfig = {
    showCreate: true,
    showImport: true,
    showExport: true,
    showModify: true,
    showRemove: true,
  };
  const showMore = false;

  // 查询模块
  const [isNewWordQueryShow, setIsNewWordQueryShow] = useState<boolean>(true);
  const [newWordPageDataSource, setNewWordPageDataSource] = useState<NewWord[]>(
    [],
  );
  const [newWordPageTotalCount, setNewWordPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const onNewWordQueryShow = () => {
    setIsNewWordQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const newWordQuery =
        (await newWordQueryForm.validateFields()) as ListNewWordsRequest;
      const pageData = BaseQueryImpl.create(current, page_size);
      const resp = await listNewWords({ ...pageData, ...newWordQuery });
      setNewWordPageDataSource(resp.records);
      setNewWordPageTotalCount(resp.total);
    };
    fetchData().then(() => {});
  }, [current, page_size]);

  const handlePaginationChange = (newPage: number, newpage_size: number) => {
    setCurrent(newPage);
    setpage_size(newpage_size);
  };
  const resetPagination = () => {
    setCurrent(1);
    setpage_size(10);
  };

  // 详情模块
  const [isNewWordDetailDrawerVisible, setIsNewWordDetailDrawerVisible] =
    useState<boolean>(false);
  const [newWordDetail, setNewWordDetail] = useState<NewWordDetail | null>(
    null,
  );
  const onNewWordDetail = async (newWord: NewWord) => {
    setIsNewWordDetailDrawerVisible(true);
    const id = newWord.id;
    await getNewWord(id).then(setNewWordDetail);
  };

  const onNewWordDetailClose = async () => {
    setNewWordDetail(null);
    setIsNewWordDetailDrawerVisible(false);
  };

  // 表格列信息
  const newWordColumns: ColumnsType<NewWord> = [
    {
      title: 'Id',
      dataIndex: '',
      key: '',
      hidden: true,
    },
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: NewWord, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '6%',
    },
    {
      title: 'word',
      dataIndex: 'word',
      key: 'word',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: 'translation',
      dataIndex: 'translation',
      key: 'translation',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: 'next_review_date',
      dataIndex: 'next_review_date',
      key: 'next_review_date',
      render: (text: string) =>
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span> : '-',
      width: '14%',
      ellipsis: true,
    },
    {
      title: 'tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      width: '6%',
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
            onClick={() => onNewWordDetail(record)}
          >
            <Eye className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateNewWord(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={() => handleDeleteNewWord(record)}
          >
            <Trash2 className="w-3 h-3" />
            删除
          </button>

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
    newWordColumns.map((col) => col.key),
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
  const filteredNewWordColumns = newWordColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [newWordQueryForm] = Form.useForm();
  const handleNewWordQueryReset = () => {
    resetPagination();
    newWordQueryForm.resetFields();
    onNewWordQueryFinish();
  };
  const onNewWordQueryFinish = async () => {
    const values = newWordQueryForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const newWordQuery = values as ListNewWordsRequest;
    const filteredNewWordQuery = Object.fromEntries(
      Object.entries(newWordQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleNewWordQueryFinish(filteredNewWordQuery as ListNewWordsRequest);
  };
  const handleNewWordQueryFinish = async (newWord: ListNewWordsRequest) => {
    await listNewWords({
      ...BaseQueryImpl.create(current, page_size),
      ...newWord,
    }).then((resp) => {
      setNewWordPageDataSource(resp.records);
      setNewWordPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isCreateNewWordModalVisible, setIsCreateNewWordModalVisible] =
    useState(false);
  const [isCreateNewWordLoading, setIsCreateNewWordLoading] = useState(false);
  const [createNewWordForm] = Form.useForm();
  const onCreateNewWord = () => {
    setIsCreateNewWordModalVisible(true);
  };
  const handleCreateNewWordCancel = () => {
    createNewWordForm.resetFields();
    setIsCreateNewWordModalVisible(false);
  };
  const handleCreateNewWordFinish = async (data: CreateNewWord) => {
    setIsCreateNewWordLoading(true);
    try {
      await createNewWord({ newWord: data });
      message.success('新增成功');
      createNewWordForm.resetFields();
      await onNewWordQueryFinish();
    } finally {
      setIsCreateNewWordLoading(false);
      setIsCreateNewWordModalVisible(false);
    }
  };

  // 单个删除模块
  const handleDeleteNewWord = async (newWord: NewWord) => {
    await deleteNewWord(newWord.id);
    message.success('删除成功');
    await onNewWordQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<NewWord[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: NewWord[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleNewWordBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteNewWord({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleNewWordBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateNewWordModalVisible, setIsUpdateNewWordModalVisible] =
    useState<boolean>(false);
  const [isUpdateNewWordLoading, setIsUpdateNewWordLoading] =
    useState<boolean>(false);
  const [updateNewWordForm] = Form.useForm();
  const onUpdateNewWord = (newWord: NewWord) => {
    setIsUpdateNewWordModalVisible(true);
    setSelectedRowKeys([newWord.id]);
    setSelectedRows([newWord]);
    updateNewWordForm.setFieldsValue({ ...newWord });
  };

  const handleUpdateNewWordCancel = () => {
    resetSelectedRows();
    updateNewWordForm.resetFields();
    setIsUpdateNewWordModalVisible(false);
  };
  const handleUpdateNewWordFinish = async () => {
    const updateNewWordData =
      (await updateNewWordForm.validateFields()) as UpdateNewWord;
    const updateData = { ...updateNewWordData, id: selectedRows[0].id };
    setIsUpdateNewWordLoading(true);
    try {
      await updateNewWord({ newWord: updateData });
      updateNewWordForm.resetFields();
      message.success('更新成功');
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsUpdateNewWordLoading(false);
      setIsUpdateNewWordModalVisible(false);
    }
  };

  // 批量更新模块
  const onNewWordBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateNewWordModalVisible(true);
      updateNewWordForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsNewWordBatchModifyModalVisible(true);
      newWordBatchModifyForm.resetFields();
    }
  };
  const [
    isNewWordBatchModifyModalVisible,
    setIsNewWordBatchModifyModalVisible,
  ] = useState<boolean>(false);
  const [isNewWordBatchModifyLoading, setIsNewWordBatchModifyLoading] =
    useState<boolean>(false);
  const [newWordBatchModifyForm] = Form.useForm();
  const handleNewWordBatchModifyCancel = async () => {
    newWordBatchModifyForm.resetFields();
    setIsNewWordBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };
  const handleNewWordBatchModifyFinish = async () => {
    const newWordBatchModify =
      (await newWordBatchModifyForm.validateFields()) as BatchUpdateNewWord;
    setIsNewWordBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateNewWords({ ids: ids, newWord: newWordBatchModify });
      newWordBatchModifyForm.resetFields();
      message.success('更新成功');
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsNewWordBatchModifyLoading(false);
      setIsNewWordBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isImportNewWordModalVisible, setIsImportNewWordModalVisible] =
    useState<boolean>(false);
  const [isImportNewWordLoading, setIsImportNewWordLoading] =
    useState<boolean>(false);
  const [createNewWordList, setCreateNewWordList] = useState<CreateNewWord[]>(
    [],
  );

  const onImportNewWord = () => {
    setIsImportNewWordModalVisible(true);
  };
  const handleImportNewWordCancel = () => {
    setIsImportNewWordModalVisible(false);
  };
  const onImportNewWordFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportNewWordLoading(true);
      const createNewWordList = await importNewWord({ file: fileList[0] });
      setCreateNewWordList(createNewWordList.newWords);
      return createNewWordList;
    } finally {
      setIsImportNewWordLoading(false);
    }
  };

  const handleImportNewWord = async () => {
    setIsImportNewWordLoading(true);
    try {
      await batchCreateNewWords({ newWords: createNewWordList });
      message.success('导入成功');
      setIsImportNewWordModalVisible(false);
      await onNewWordQueryFinish();
    } finally {
      setIsImportNewWordLoading(false);
      setCreateNewWordList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onNewWordExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportNewWord({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isNewWordQueryShow}>
        <NewWordQueryComponent
          onNewWordQueryFinish={onNewWordQueryFinish}
          onNewWordQueryReset={handleNewWordQueryReset}
          newWordQueryForm={newWordQueryForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateNewWord}
          onImport={onImportNewWord}
          onExport={onNewWordExport}
          onBatchModify={onNewWordBatchModify}
          onConfirmBatchRemove={handleNewWordBatchRemove}
          onConfirmBatchRemoveCancel={handleNewWordBatchRemoveCancel}
          isQueryShow={isNewWordQueryShow}
          onQueryShow={onNewWordQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={newWordColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<NewWord>
          columns={filteredNewWordColumns}
          dataSource={newWordPageDataSource}
          total={newWordPageTotalCount}
          current={current}
          page_size={page_size}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
        />
      </div>
      <div>
        <div>
          <CreateNewWordComponent
            isCreateNewWordModalVisible={isCreateNewWordModalVisible}
            onCreateNewWordCancel={handleCreateNewWordCancel}
            onCreateNewWordFinish={handleCreateNewWordFinish}
            isCreateNewWordLoading={isCreateNewWordLoading}
            createNewWordForm={createNewWordForm}
            treeSelectDataSource={newWordPageDataSource}
          />
        </div>
        <div>
          <NewWordDetailComponent
            isNewWordDetailDrawerVisible={isNewWordDetailDrawerVisible}
            onNewWordDetailClose={onNewWordDetailClose}
            newWordDetail={newWordDetail}
          />
        </div>
        <div>
          <UpdateNewWordComponent
            isUpdateNewWordModalVisible={isUpdateNewWordModalVisible}
            onUpdateNewWordCancel={handleUpdateNewWordCancel}
            onUpdateNewWordFinish={handleUpdateNewWordFinish}
            isUpdateNewWordLoading={isUpdateNewWordLoading}
            updateNewWordForm={updateNewWordForm}
            treeSelectDataSource={newWordPageDataSource}
          />
        </div>
        <div>
          <BatchUpdateNewWordComponent
            isBatchUpdateNewWordsModalVisible={isNewWordBatchModifyModalVisible}
            onBatchUpdateNewWordsCancel={handleNewWordBatchModifyCancel}
            onBatchUpdateNewWordsFinish={handleNewWordBatchModifyFinish}
            isBatchUpdateNewWordsLoading={isNewWordBatchModifyLoading}
            batchUpdateNewWordsForm={newWordBatchModifyForm}
            treeSelectDataSource={newWordPageDataSource}
          />
        </div>
        <div>
          <ImportNewWordComponent
            isImportNewWordModalVisible={isImportNewWordModalVisible}
            isImportNewWordLoading={isImportNewWordLoading}
            onImportNewWordFinish={onImportNewWordFinish}
            onImportNewWordCancel={handleImportNewWordCancel}
            handleImportNewWord={handleImportNewWord}
          />
        </div>
      </div>
    </div>
  );
};

export default NewWordPage;
