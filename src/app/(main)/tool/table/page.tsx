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
import SvgIcon from '@/components/svg-icon';
import {
  batchCreateTables,
  batchDeleteTable,
  batchUpdateTables,
  createTable,
  deleteTable,
  exportTable,
  getTable,
  importTable,
  listTables,
  updateTable,
} from '@/service/table';
import { BaseQueryImpl } from '@/types';
import {
  BatchUpdateTable,
  CreateTable,
  ListTablesRequest,
  Table,
  TableDetail,
  UpdateTable,
} from '@/types/table';
import { Form, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import BatchUpdateTableComponent from './components/batch-update-table';
import CreateTableComponent from './components/create-table';
import ImportTableComponent from './components/import-table';
import TableDetailComponent from './components/table-detail';
import TableQueryComponent from './components/query-table';
import UpdateTableComponent from './components/update-table';

const TablePage: React.FC = () => {
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
  const [isTableQueryShow, setIsTableQueryShow] = useState<boolean>(true);
  const [tablePageDataSource, setTablePageDataSource] = useState<Table[]>([]);
  const [tablePageTotalCount, setTablePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const onTableQueryShow = () => {
    setIsTableQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const tableQuery =
        (await tableQueryForm.validateFields()) as ListTablesRequest;
      const pageData = BaseQueryImpl.create(current, page_size);
      const resp = await listTables({ ...pageData, ...tableQuery });
      setTablePageDataSource(resp.records);
      setTablePageTotalCount(resp.total);
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
  const [isTableDetailDrawerVisible, setIsTableDetailDrawerVisible] =
    useState<boolean>(false);
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const onTableDetail = async (table: Table) => {
    setIsTableDetailDrawerVisible(true);
    const id = table.id;
    await getTable(id).then(setTableDetail);
  };

  const onTableDetailClose = async () => {
    setTableDetail(null);
    setIsTableDetailDrawerVisible(false);
  };

  // 表格列信息
  const tableColumns: ColumnsType<Table> = [
    {
      title: "Id",
      dataIndex: "",
      key: "",
      hidden: true,
    },
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: Table, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      width: "6%",
    },
    {
      title: "database_id",
      dataIndex: "database_id",
      key: "database_id",
      width: "6%",
    },
    {
      title: "db_table_id",
      dataIndex: "db_table_id",
      key: "db_table_id",
      width: "6%",
    },
    {
      title: "table_name",
      dataIndex: "table_name",
      key: "table_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "sub_table_name",
      dataIndex: "sub_table_name",
      key: "sub_table_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "sub_table_fk_name",
      dataIndex: "sub_table_fk_name",
      key: "sub_table_fk_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "class_name",
      dataIndex: "class_name",
      key: "class_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "backend",
      dataIndex: "backend",
      key: "backend",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "tpl_category",
      dataIndex: "tpl_category",
      key: "tpl_category",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "tpl_web_type",
      dataIndex: "tpl_web_type",
      key: "tpl_web_type",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "tpl_backend_type",
      dataIndex: "tpl_backend_type",
      key: "tpl_backend_type",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "package_name",
      dataIndex: "package_name",
      key: "package_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "module_name",
      dataIndex: "module_name",
      key: "module_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "business_name",
      dataIndex: "business_name",
      key: "business_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "function_name",
      dataIndex: "function_name",
      key: "function_name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "function_author",
      dataIndex: "function_author",
      key: "function_author",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "gen_type",
      dataIndex: "gen_type",
      key: "gen_type",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "gen_path",
      dataIndex: "gen_path",
      key: "gen_path",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "options",
      dataIndex: "options",
      key: "options",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "comment",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "create_time",
      dataIndex: "create_time",
      key: "create_time",
      render: (text: string) => (
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>: "-"
      ),
      width: "14%",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onTableDetail(record)}
          >
            <Eye className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onUpdateTable(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleDeleteTable(record)}
          >
            <Trash2 className="w-3 h-3" />
            删除
          </button>

          {showMore && (
            <button type="button" className="flex items-center gap-0.5 text-xs btn-operation">
              <span>更多</span>
              <MoreHorizontal className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState(
    tableColumns.map((col) => col.key),
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
  const filteredTableColumns = tableColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [tableQueryForm] = Form.useForm();
  const handleTableQueryReset = () => {
    resetPagination();
    tableQueryForm.resetFields();
    onTableQueryFinish();
  };
  const onTableQueryFinish = async () => {
    const values = tableQueryForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const tableQuery = values as ListTablesRequest;
    const filteredTableQuery = Object.fromEntries(
      Object.entries(tableQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleTableQueryFinish(filteredTableQuery as ListTablesRequest);
  };
  const handleTableQueryFinish = async (table: ListTablesRequest) => {
    await listTables({
      ...BaseQueryImpl.create(current, page_size),
      ...table,
    }).then((resp) => {
      setTablePageDataSource(resp.records);
      setTablePageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isCreateTableModalVisible, setIsCreateTableModalVisible] =
    useState(false);
  const [isCreateTableLoading, setIsCreateTableLoading] = useState(false);
  const [createTableForm] = Form.useForm();
  const onCreateTable = () => {
    setIsCreateTableModalVisible(true);
  };
  const handleCreateTableCancel = () => {
    createTableForm.resetFields();
    setIsCreateTableModalVisible(false);
  };
  const handleCreateTableFinish = async (data: CreateTable) => {
    setIsCreateTableLoading(true);
    try {
      await createTable({ table: data });
      message.success('新增成功');
      createTableForm.resetFields();
      await onTableQueryFinish();
    } finally {
      setIsCreateTableLoading(false);
      setIsCreateTableModalVisible(false);
    }
  };

  // 单个删除模块
  const handleDeleteTable = async (table: Table) => {
    await deleteTable(table.id);
    message.success("删除成功")
    await onTableQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Table[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Table[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleTableBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteTable({ ids: selectedRows.map((row) => row.id) });
      message.success("删除成功")
      await onTableQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleTableBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateTableModalVisible, setIsUpdateTableModalVisible] =
    useState<boolean>(false);
  const [isUpdateTableLoading, setIsUpdateTableLoading] =
    useState<boolean>(false);
  const [updateTableForm] = Form.useForm();
  const onUpdateTable = (table: Table) => {
    setIsUpdateTableModalVisible(true);
    setSelectedRowKeys([table.id]);
    setSelectedRows([table]);
    updateTableForm.setFieldsValue({ ...table });
  };

  const handleUpdateTableCancel = () => {
    resetSelectedRows();
    updateTableForm.resetFields();
    setIsUpdateTableModalVisible(false);
  };
  const handleUpdateTableFinish = async () => {
    const updateTableData =
      (await updateTableForm.validateFields()) as UpdateTable;
    const updateData = { ...updateTableData, id: selectedRows[0].id };
    setIsUpdateTableLoading(true);
    try {
      await updateTable({ table: updateData });
      updateTableForm.resetFields();
      message.success('更新成功');
      await onTableQueryFinish();
      resetSelectedRows();
    } finally {
      setIsUpdateTableLoading(false);
      setIsUpdateTableModalVisible(false);
    }
  };

  // 批量更新模块
  const onTableBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateTableModalVisible(true);
      updateTableForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsTableBatchModifyModalVisible(true);
      tableBatchModifyForm.resetFields();
    }
  };
  const [isTableBatchModifyModalVisible, setIsTableBatchModifyModalVisible] =
    useState<boolean>(false);
  const [isTableBatchModifyLoading, setIsTableBatchModifyLoading] =
    useState<boolean>(false);
  const [tableBatchModifyForm] = Form.useForm();
  const handleTableBatchModifyCancel = async () => {
    tableBatchModifyForm.resetFields();
    setIsTableBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };
  const handleTableBatchModifyFinish = async () => {
    const tableBatchModify =
      (await tableBatchModifyForm.validateFields()) as BatchUpdateTable;
    setIsTableBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateTables({ ids: ids, table: tableBatchModify });
      tableBatchModifyForm.resetFields();
      message.success('更新成功');
      await onTableQueryFinish();
      resetSelectedRows();
    } finally {
      setIsTableBatchModifyLoading(false);
      setIsTableBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isImportTableModalVisible, setIsImportTableModalVisible] =
    useState<boolean>(false);
  const [isImportTableLoading, setIsImportTableLoading] =
    useState<boolean>(false);
  const [createTableList, setCreateTableList] = useState<CreateTable[]>([]);

  const onImportTable = () => {
    setIsImportTableModalVisible(true);
  };
  const handleImportTableCancel = () => {
    setIsImportTableModalVisible(false);
  };
  const onImportTableFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportTableLoading(true);
      const createTableList = await importTable({ file: fileList[0] });
      setCreateTableList(createTableList.tables);
      return createTableList;
    } finally {
      setIsImportTableLoading(false);
    }
  };

  const handleImportTable = async () => {
    setIsImportTableLoading(true);
    try {
      await batchCreateTables({ tables: createTableList });
      message.success('导入成功');
      setIsImportTableModalVisible(false);
      await onTableQueryFinish();
    } finally {
      setIsImportTableLoading(false);
      setCreateTableList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onTableExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportTable({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isTableQueryShow}>
        <TableQueryComponent
          onTableQueryFinish={onTableQueryFinish}
          onTableQueryReset={handleTableQueryReset}
          tableQueryForm={ tableQueryForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateTable}
          onImport={onImportTable}
          onExport={onTableExport}
          onBatchModify={onTableBatchModify}
          onConfirmBatchRemove={handleTableBatchRemove}
          onConfirmBatchRemoveCancel={handleTableBatchRemoveCancel}
          isQueryShow={isTableQueryShow}
          onQueryShow={onTableQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ tableColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<Table>
          columns={filteredTableColumns}
          dataSource={ tablePageDataSource}
          total={ tablePageTotalCount}
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
          <CreateTableComponent
            isCreateTableModalVisible={isCreateTableModalVisible}
            onCreateTableCancel={handleCreateTableCancel}
            onCreateTableFinish={handleCreateTableFinish}
            isCreateTableLoading={isCreateTableLoading}
            createTableForm={createTableForm}
            treeSelectDataSource={ tablePageDataSource}
          />
        </div>
        <div>
          <TableDetailComponent
            isTableDetailDrawerVisible={isTableDetailDrawerVisible}
            onTableDetailClose={onTableDetailClose}
            tableDetail={ tableDetail}
          />
        </div>
        <div>
          <UpdateTableComponent
            isUpdateTableModalVisible={isUpdateTableModalVisible}
            onUpdateTableCancel={handleUpdateTableCancel}
            onUpdateTableFinish={handleUpdateTableFinish}
            isUpdateTableLoading={isUpdateTableLoading}
            updateTableForm={updateTableForm}
            treeSelectDataSource={ tablePageDataSource}
          />
        </div>
        <div>
          <BatchUpdateTableComponent
            isBatchUpdateTablesModalVisible={isTableBatchModifyModalVisible}
            onBatchUpdateTablesCancel={handleTableBatchModifyCancel}
            onBatchUpdateTablesFinish={handleTableBatchModifyFinish}
            isBatchUpdateTablesLoading={isTableBatchModifyLoading}
            batchUpdateTablesForm={ tableBatchModifyForm}
            treeSelectDataSource={ tablePageDataSource}
          />
        </div>
        <div>
          <ImportTableComponent
            isImportTableModalVisible={isImportTableModalVisible}
            isImportTableLoading={isImportTableLoading}
            onImportTableFinish={onImportTableFinish}
            onImportTableCancel={handleImportTableCancel}
            handleImportTable={handleImportTable}
          />
        </div>
      </div>
    </div>
  );
};

export default TablePage;