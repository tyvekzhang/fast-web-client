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
  batchCreateUserRoles,
  batchDeleteUserRole,
  batchUpdateUserRoles,
  createUserRole,
  deleteUserRole,
  exportUserRole,
  importUserRole,
  updateUserRole,
  useUserRole,
  useUserRoles,
} from '@/service/user-role';
import { createPaginationRequest } from '@/types';
import {
  BatchUpdateUserRole,
  CreateUserRole,
  ListUserRolesRequest,
  UpdateUserRole,
  UserRole,
} from '@/types/user-role';
import { Form, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import BatchUpdateUserRoleComponent from './components/batch-update-user-role';
import CreateUserRoleComponent from './components/create-user-role';
import ImportUserRoleComponent from './components/import-user-role';
import QueryUserRoleComponent from './components/query-user-role';
import UpdateUserRoleComponent from './components/update-user-role';
import UserRoleDetailComponent from './components/user-role-detail';

const UserRolePage: React.FC = () => {
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
  const [isQueryUserRoleShow, setIsQueryUserRoleShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryUserRoleForm] = Form.useForm();
  const [userRoleQueryParams, setUserRoleQueryParams] =
    useState<ListUserRolesRequest>();

  // 用 useUserRoles 获取菜单列表数据
  const {
    userRoles: userRoleListDataSource,
    total,
    isLoading: isUserRoleListLoading,
    mutateUserRoles,
  } = useUserRoles({
    ...userRoleQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryUserRoleShow = () => {
    setIsQueryUserRoleShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryUserRoleReset = () => {
    resetPagination();
    queryUserRoleForm.resetFields();
    mutateUserRoles();
  };

  const onQueryUserRoleFinish = async () => {
    const values = queryUserRoleForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryUserRole = values as ListUserRolesRequest;
    const filteredQueryUserRole = Object.fromEntries(
      Object.entries(queryUserRole).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setUserRoleQueryParams(filteredQueryUserRole as ListUserRolesRequest);
  };

  // 详情模块
  const [isUserRoleDetailDrawerVisible, setIsUserRoleDetailDrawerVisible] =
    useState(false);
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<string | null>(
    null,
  );

  const { userRole: userRoleDetail, isLoading: isUserRoleDetailLoading } =
    useUserRole(selectedUserRoleId || '');

  const onUserRoleDetail = (userRole: UserRole) => {
    setSelectedUserRoleId(userRole.id);
    setIsUserRoleDetailDrawerVisible(true);
  };

  const onUserRoleDetailClose = () => {
    setSelectedUserRoleId(null);
    setIsUserRoleDetailDrawerVisible(false);
  };

  // 表格列信息
  const userRoleColumns: ColumnsType<UserRole> = [
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
      render: (_: number, _record: UserRole, rowIndex: number) => rowIndex + 1,
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
            onClick={() => onUserRoleDetail(record)}
          >
            <Eye className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateUserRole(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteUserRole(record)}
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
    userRoleColumns.map((col) => col.key),
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
  const filteredUserRoleColumns = userRoleColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateUserRoleModalVisible, setIsCreateUserRoleModalVisible] =
    useState(false);
  const [isCreateUserRoleLoading, setIsCreateUserRoleLoading] = useState(false);
  const [createUserRoleForm] = Form.useForm();

  const onCreateUserRole = () => {
    setIsCreateUserRoleModalVisible(true);
  };
  const handleCreateUserRoleCancel = () => {
    createUserRoleForm.resetFields();
    setIsCreateUserRoleModalVisible(false);
  };
  const handleCreateUserRoleFinish = async (data: CreateUserRole) => {
    setIsCreateUserRoleLoading(true);
    try {
      await createUserRole({ userRole: data });
      message.success('新增成功');
      createUserRoleForm.resetFields();
      setIsCreateUserRoleModalVisible(false);
      mutateUserRoles();
    } finally {
      setIsCreateUserRoleLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteUserRole = async (userRole: UserRole) => {
    await deleteUserRole(userRole.id);
    message.success('删除成功');
    mutateUserRoles();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserRole[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: UserRole[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleUserRoleBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteUserRole({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateUserRoles();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleUserRoleBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateUserRoleModalVisible, setIsUpdateUserRoleModalVisible] =
    useState<boolean>(false);
  const [isUpdateUserRoleLoading, setIsUpdateUserRoleLoading] =
    useState<boolean>(false);
  const [updateUserRoleForm] = Form.useForm();

  const onUpdateUserRole = (userRole: UserRole) => {
    setIsUpdateUserRoleModalVisible(true);
    setSelectedRowKeys([userRole.id]);
    setSelectedRows([userRole]);
    updateUserRoleForm.setFieldsValue({ ...userRole });
  };

  const handleUpdateUserRoleCancel = () => {
    resetSelectedRows();
    updateUserRoleForm.resetFields();
    setIsUpdateUserRoleModalVisible(false);
  };

  const handleUpdateUserRoleFinish = async () => {
    const updateUserRoleData =
      (await updateUserRoleForm.validateFields()) as UpdateUserRole;
    const req = { ...updateUserRoleData, id: selectedRows[0].id };
    setIsUpdateUserRoleLoading(true);
    try {
      await updateUserRole({ userRole: req });
      updateUserRoleForm.resetFields();
      message.success('更新成功');
      mutateUserRoles();
      resetSelectedRows();
    } finally {
      setIsUpdateUserRoleLoading(false);
      setIsUpdateUserRoleModalVisible(false);
    }
  };

  // 批量更新模块
  const onUserRoleBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateUserRoleModalVisible(true);
      updateUserRoleForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsBatchUpdateUserRolesModalVisible(true);
      batchUpdateUserRolesForm.resetFields();
    }
  };
  const [
    isBatchUpdateUserRolesModalVisible,
    setIsBatchUpdateUserRolesModalVisible,
  ] = useState<boolean>(false);
  const [isBatchUpdateUserRolesLoading, setIsBatchUpdateUserRolesLoading] =
    useState<boolean>(false);
  const [batchUpdateUserRolesForm] = Form.useForm();

  const handleBatchUpdateUserRolesCancel = async () => {
    batchUpdateUserRolesForm.resetFields();
    setIsBatchUpdateUserRolesModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };

  const handleBatchUpdateUserRolesFinish = async () => {
    const userRoleBatchModify =
      (await batchUpdateUserRolesForm.validateFields()) as BatchUpdateUserRole;
    setIsBatchUpdateUserRolesLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateUserRoles({ ids: ids, userRole: userRoleBatchModify });
      batchUpdateUserRolesForm.resetFields();
      message.success('更新成功');
      mutateUserRoles();
      resetSelectedRows();
    } finally {
      setIsBatchUpdateUserRolesLoading(false);
      setIsBatchUpdateUserRolesModalVisible(false);
    }
  };

  // 导入模块
  const [isImportUserRoleModalVisible, setIsImportUserRoleModalVisible] =
    useState<boolean>(false);
  const [isImportUserRoleLoading, setIsImportUserRoleLoading] =
    useState<boolean>(false);
  const [createUserRoleList, setCreateUserRoleList] = useState<
    CreateUserRole[]
  >([]);

  const onImportUserRole = () => {
    setIsImportUserRoleModalVisible(true);
  };

  const handleImportUserRoleCancel = () => {
    setIsImportUserRoleModalVisible(false);
  };

  const onImportUserRoleFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportUserRoleLoading(true);
      const createUserRoleList = await importUserRole({ file: fileList[0] });
      setCreateUserRoleList(createUserRoleList.userRoles);
      return createUserRoleList;
    } finally {
      setIsImportUserRoleLoading(false);
    }
  };

  const handleImportUserRole = async () => {
    setIsImportUserRoleLoading(true);
    try {
      await batchCreateUserRoles({ userRoles: createUserRoleList });
      message.success('导入成功');
      setIsImportUserRoleModalVisible(false);
      mutateUserRoles();
    } finally {
      setIsImportUserRoleLoading(false);
      setCreateUserRoleList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onUserRoleExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportUserRole({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryUserRoleShow}>
        <QueryUserRoleComponent
          onQueryUserRoleFinish={onQueryUserRoleFinish}
          onQueryUserRoleReset={handleQueryUserRoleReset}
          onQueryUserRoleForm={queryUserRoleForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateUserRole}
          onImport={onImportUserRole}
          onExport={onUserRoleExport}
          onBatchModify={onUserRoleBatchModify}
          onConfirmBatchRemove={handleUserRoleBatchRemove}
          onConfirmBatchRemoveCancel={handleUserRoleBatchRemoveCancel}
          isQueryShow={isQueryUserRoleShow}
          onQueryShow={onQueryUserRoleShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={userRoleColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<UserRole>
          columns={filteredUserRoleColumns}
          dataSource={userRoleListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isUserRoleListLoading}
        />
      </div>
      <div>
        <div>
          <CreateUserRoleComponent
            isCreateUserRoleModalVisible={isCreateUserRoleModalVisible}
            onCreateUserRoleCancel={handleCreateUserRoleCancel}
            onCreateUserRoleFinish={handleCreateUserRoleFinish}
            isCreateUserRoleLoading={isCreateUserRoleLoading}
            createUserRoleForm={createUserRoleForm}
            treeSelectDataSource={userRoleListDataSource}
          />
        </div>
        <div>
          <UserRoleDetailComponent
            isUserRoleDetailDrawerVisible={isUserRoleDetailDrawerVisible}
            onUserRoleDetailClose={onUserRoleDetailClose}
            userRoleDetail={userRoleDetail}
            loading={isUserRoleDetailLoading}
          />
        </div>
        <div>
          <UpdateUserRoleComponent
            isUpdateUserRoleModalVisible={isUpdateUserRoleModalVisible}
            onUpdateUserRoleCancel={handleUpdateUserRoleCancel}
            onUpdateUserRoleFinish={handleUpdateUserRoleFinish}
            isUpdateUserRoleLoading={isUpdateUserRoleLoading}
            updateUserRoleForm={updateUserRoleForm}
            treeSelectDataSource={userRoleListDataSource}
          />
        </div>
        <div>
          <BatchUpdateUserRoleComponent
            isBatchUpdateUserRolesModalVisible={
              isBatchUpdateUserRolesModalVisible
            }
            onBatchUpdateUserRolesCancel={handleBatchUpdateUserRolesCancel}
            onBatchUpdateUserRolesFinish={handleBatchUpdateUserRolesFinish}
            isBatchUpdateUserRolesLoading={isBatchUpdateUserRolesLoading}
            batchUpdateUserRolesForm={batchUpdateUserRolesForm}
          />
        </div>

        <div>
          <ImportUserRoleComponent
            isImportUserRoleModalVisible={isImportUserRoleModalVisible}
            isImportUserRoleLoading={isImportUserRoleLoading}
            onImportUserRoleFinish={onImportUserRoleFinish}
            onImportUserRoleCancel={handleImportUserRoleCancel}
            handleImportUserRole={handleImportUserRole}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRolePage;
