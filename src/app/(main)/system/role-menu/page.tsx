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
  batchCreateRoleMenus,
  batchDeleteRoleMenu,
  batchUpdateRoleMenus,
  createRoleMenu,
  deleteRoleMenu,
  exportRoleMenu,
  importRoleMenu,
  updateRoleMenu,
  useRoleMenu,
  useRoleMenus,
} from '@/service/role-menu';
import { createPaginationRequest } from '@/types';
import {
  BatchUpdateRoleMenu,
  CreateRoleMenu,
  ListRoleMenusRequest,
  RoleMenu,
  UpdateRoleMenu,
} from '@/types/role-menu';
import { Form, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import BatchUpdateRoleMenuComponent from './components/batch-update-role-menu';
import CreateRoleMenuComponent from './components/create-role-menu';
import ImportRoleMenuComponent from './components/import-role-menu';
import QueryRoleMenuComponent from './components/query-role-menu';
import RoleMenuDetailComponent from './components/role-menu-detail';
import UpdateRoleMenuComponent from './components/update-role-menu';

const RoleMenuPage: React.FC = () => {
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
  const [isQueryRoleMenuShow, setIsQueryRoleMenuShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryRoleMenuForm] = Form.useForm();
  const [roleMenuQueryParams, setRoleMenuQueryParams] =
    useState<ListRoleMenusRequest>();

  // 用 useRoleMenus 获取菜单列表数据
  const {
    roleMenus: roleMenuListDataSource,
    total,
    isLoading: isRoleMenuListLoading,
    mutateRoleMenus,
  } = useRoleMenus({
    ...roleMenuQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryRoleMenuShow = () => {
    setIsQueryRoleMenuShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryRoleMenuReset = () => {
    resetPagination();
    queryRoleMenuForm.resetFields();
    mutateRoleMenus();
  };

  const onQueryRoleMenuFinish = async () => {
    const values = queryRoleMenuForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryRoleMenu = values as ListRoleMenusRequest;
    const filteredQueryRoleMenu = Object.fromEntries(
      Object.entries(queryRoleMenu).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setRoleMenuQueryParams(filteredQueryRoleMenu as ListRoleMenusRequest);
  };

  // 详情模块
  const [isRoleMenuDetailDrawerVisible, setIsRoleMenuDetailDrawerVisible] =
    useState(false);
  const [selectedRoleMenuId, setSelectedRoleMenuId] = useState<string | null>(
    null,
  );

  const { roleMenu: roleMenuDetail, isLoading: isRoleMenuDetailLoading } =
    useRoleMenu(selectedRoleMenuId || '');

  const onRoleMenuDetail = (roleMenu: RoleMenu) => {
    setSelectedRoleMenuId(roleMenu.id);
    setIsRoleMenuDetailDrawerVisible(true);
  };

  const onRoleMenuDetailClose = () => {
    setSelectedRoleMenuId(null);
    setIsRoleMenuDetailDrawerVisible(false);
  };

  // 表格列信息
  const roleMenuColumns: ColumnsType<RoleMenu> = [
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
      render: (_: number, _record: RoleMenu, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '自增编号',
      dataIndex: 'id',
      key: 'id',
      width: '6%',
    },
    {
      title: '角色ID',
      dataIndex: 'role_id',
      key: 'role_id',
      width: '6%',
    },
    {
      title: '菜单ID',
      dataIndex: 'menu_id',
      key: 'menu_id',
      width: '6%',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string) =>
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span> : '-',
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
            onClick={() => onRoleMenuDetail(record)}
          >
            <Eye className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateRoleMenu(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteRoleMenu(record)}
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
    roleMenuColumns.map((col) => col.key),
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
  const filteredRoleMenuColumns = roleMenuColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateRoleMenuModalVisible, setIsCreateRoleMenuModalVisible] =
    useState(false);
  const [isCreateRoleMenuLoading, setIsCreateRoleMenuLoading] = useState(false);
  const [createRoleMenuForm] = Form.useForm();

  const onCreateRoleMenu = () => {
    setIsCreateRoleMenuModalVisible(true);
  };
  const handleCreateRoleMenuCancel = () => {
    createRoleMenuForm.resetFields();
    setIsCreateRoleMenuModalVisible(false);
  };
  const handleCreateRoleMenuFinish = async (data: CreateRoleMenu) => {
    setIsCreateRoleMenuLoading(true);
    try {
      await createRoleMenu({ roleMenu: data });
      message.success('新增成功');
      createRoleMenuForm.resetFields();
      setIsCreateRoleMenuModalVisible(false);
      mutateRoleMenus();
    } finally {
      setIsCreateRoleMenuLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteRoleMenu = async (roleMenu: RoleMenu) => {
    await deleteRoleMenu(roleMenu.id);
    message.success('删除成功');
    mutateRoleMenus();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RoleMenu[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: RoleMenu[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleRoleMenuBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteRoleMenu({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateRoleMenus();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleRoleMenuBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateRoleMenuModalVisible, setIsUpdateRoleMenuModalVisible] =
    useState<boolean>(false);
  const [isUpdateRoleMenuLoading, setIsUpdateRoleMenuLoading] =
    useState<boolean>(false);
  const [updateRoleMenuForm] = Form.useForm();

  const onUpdateRoleMenu = (roleMenu: RoleMenu) => {
    setIsUpdateRoleMenuModalVisible(true);
    setSelectedRowKeys([roleMenu.id]);
    setSelectedRows([roleMenu]);
    updateRoleMenuForm.setFieldsValue({ ...roleMenu });
  };

  const handleUpdateRoleMenuCancel = () => {
    resetSelectedRows();
    updateRoleMenuForm.resetFields();
    setIsUpdateRoleMenuModalVisible(false);
  };

  const handleUpdateRoleMenuFinish = async () => {
    const updateRoleMenuData =
      (await updateRoleMenuForm.validateFields()) as UpdateRoleMenu;
    const req = { ...updateRoleMenuData, id: selectedRows[0].id };
    setIsUpdateRoleMenuLoading(true);
    try {
      await updateRoleMenu({ roleMenu: req });
      updateRoleMenuForm.resetFields();
      message.success('更新成功');
      mutateRoleMenus();
      resetSelectedRows();
    } finally {
      setIsUpdateRoleMenuLoading(false);
      setIsUpdateRoleMenuModalVisible(false);
    }
  };

  // 批量更新模块
  const onRoleMenuBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateRoleMenuModalVisible(true);
      updateRoleMenuForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsBatchUpdateRoleMenusModalVisible(true);
      batchUpdateRoleMenusForm.resetFields();
    }
  };
  const [
    isBatchUpdateRoleMenusModalVisible,
    setIsBatchUpdateRoleMenusModalVisible,
  ] = useState<boolean>(false);
  const [isBatchUpdateRoleMenusLoading, setIsBatchUpdateRoleMenusLoading] =
    useState<boolean>(false);
  const [batchUpdateRoleMenusForm] = Form.useForm();

  const handleBatchUpdateRoleMenusCancel = async () => {
    batchUpdateRoleMenusForm.resetFields();
    setIsBatchUpdateRoleMenusModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };

  const handleBatchUpdateRoleMenusFinish = async () => {
    const roleMenuBatchModify =
      (await batchUpdateRoleMenusForm.validateFields()) as BatchUpdateRoleMenu;
    setIsBatchUpdateRoleMenusLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateRoleMenus({ ids: ids, roleMenu: roleMenuBatchModify });
      batchUpdateRoleMenusForm.resetFields();
      message.success('更新成功');
      mutateRoleMenus();
      resetSelectedRows();
    } finally {
      setIsBatchUpdateRoleMenusLoading(false);
      setIsBatchUpdateRoleMenusModalVisible(false);
    }
  };

  // 导入模块
  const [isImportRoleMenuModalVisible, setIsImportRoleMenuModalVisible] =
    useState<boolean>(false);
  const [isImportRoleMenuLoading, setIsImportRoleMenuLoading] =
    useState<boolean>(false);
  const [createRoleMenuList, setCreateRoleMenuList] = useState<
    CreateRoleMenu[]
  >([]);

  const onImportRoleMenu = () => {
    setIsImportRoleMenuModalVisible(true);
  };

  const handleImportRoleMenuCancel = () => {
    setIsImportRoleMenuModalVisible(false);
  };

  const onImportRoleMenuFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportRoleMenuLoading(true);
      const createRoleMenuList = await importRoleMenu({ file: fileList[0] });
      setCreateRoleMenuList(createRoleMenuList.roleMenus);
      return createRoleMenuList;
    } finally {
      setIsImportRoleMenuLoading(false);
    }
  };

  const handleImportRoleMenu = async () => {
    setIsImportRoleMenuLoading(true);
    try {
      await batchCreateRoleMenus({ roleMenus: createRoleMenuList });
      message.success('导入成功');
      setIsImportRoleMenuModalVisible(false);
      mutateRoleMenus();
    } finally {
      setIsImportRoleMenuLoading(false);
      setCreateRoleMenuList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onRoleMenuExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportRoleMenu({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryRoleMenuShow}>
        <QueryRoleMenuComponent
          onQueryRoleMenuFinish={onQueryRoleMenuFinish}
          onQueryRoleMenuReset={handleQueryRoleMenuReset}
          onQueryRoleMenuForm={queryRoleMenuForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateRoleMenu}
          onImport={onImportRoleMenu}
          onExport={onRoleMenuExport}
          onBatchModify={onRoleMenuBatchModify}
          onConfirmBatchRemove={handleRoleMenuBatchRemove}
          onConfirmBatchRemoveCancel={handleRoleMenuBatchRemoveCancel}
          isQueryShow={isQueryRoleMenuShow}
          onQueryShow={onQueryRoleMenuShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={roleMenuColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<RoleMenu>
          columns={filteredRoleMenuColumns}
          dataSource={roleMenuListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isRoleMenuListLoading}
        />
      </div>
      <div>
        <div>
          <CreateRoleMenuComponent
            isCreateRoleMenuModalVisible={isCreateRoleMenuModalVisible}
            onCreateRoleMenuCancel={handleCreateRoleMenuCancel}
            onCreateRoleMenuFinish={handleCreateRoleMenuFinish}
            isCreateRoleMenuLoading={isCreateRoleMenuLoading}
            createRoleMenuForm={createRoleMenuForm}
            treeSelectDataSource={roleMenuListDataSource}
          />
        </div>
        <div>
          <RoleMenuDetailComponent
            isRoleMenuDetailDrawerVisible={isRoleMenuDetailDrawerVisible}
            onRoleMenuDetailClose={onRoleMenuDetailClose}
            roleMenuDetail={roleMenuDetail}
            loading={isRoleMenuDetailLoading}
          />
        </div>
        <div>
          <UpdateRoleMenuComponent
            isUpdateRoleMenuModalVisible={isUpdateRoleMenuModalVisible}
            onUpdateRoleMenuCancel={handleUpdateRoleMenuCancel}
            onUpdateRoleMenuFinish={handleUpdateRoleMenuFinish}
            isUpdateRoleMenuLoading={isUpdateRoleMenuLoading}
            updateRoleMenuForm={updateRoleMenuForm}
            treeSelectDataSource={roleMenuListDataSource}
          />
        </div>
        <div>
          <BatchUpdateRoleMenuComponent
            isBatchUpdateRoleMenusModalVisible={
              isBatchUpdateRoleMenusModalVisible
            }
            onBatchUpdateRoleMenusCancel={handleBatchUpdateRoleMenusCancel}
            onBatchUpdateRoleMenusFinish={handleBatchUpdateRoleMenusFinish}
            isBatchUpdateRoleMenusLoading={isBatchUpdateRoleMenusLoading}
            batchUpdateRoleMenusForm={batchUpdateRoleMenusForm}
          />
        </div>

        <div>
          <ImportRoleMenuComponent
            isImportRoleMenuModalVisible={isImportRoleMenuModalVisible}
            isImportRoleMenuLoading={isImportRoleMenuLoading}
            onImportRoleMenuFinish={onImportRoleMenuFinish}
            onImportRoleMenuCancel={handleImportRoleMenuCancel}
            handleImportRoleMenu={handleImportRoleMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleMenuPage;
