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
import { useDictDataOptions } from '@/service/dict-datum';
import { useRoles } from '@/service/role';
import {
  batchCreateUsers,
  batchDeleteUser,
  batchUpdateUsers,
  createUser,
  deleteUser,
  exportUser,
  importUser,
  updateUser,
  useUsers,
} from '@/service/user';
import { assignUserRoles } from '@/service/user-role';
import { createPaginationRequest } from '@/types';
import {
  BatchUpdateUser,
  CreateUser,
  ListUsersRequest,
  UpdateUser,
  User,
} from '@/types/user';
import { ListUserRolesRequest } from '@/types/user-role';
import { Button, Form, Input, message, Modal, Popconfirm, Select } from 'antd'; // 添加 Modal, Select, Button
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { CheckCircle2, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import BatchUpdateUserComponent from './components/batch-update-user';
import CreateUserComponent from './components/create-user';
import ImportUserComponent from './components/import-user';
import QueryUserComponent from './components/query-user';
import UpdateUserComponent from './components/update-user';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const UserPage: React.FC = () => {
  // 配置模块
  const actionConfig = {
    showCreate: true,
    showImport: true,
    showExport: true,
    showModify: true,
    showRemove: true,
  };
  const showMore = false;

  const { dictData } = useDictDataOptions('user_status'.split(','));

  // 查询模块
  const [isQueryUserShow, setIsQueryUserShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryUserForm] = Form.useForm();
  const [userQueryParams, setUserQueryParams] = useState<ListUsersRequest>();

  // 用 useUsers 获取菜单列表数据
  const {
    users: userListDataSource,
    total,
    isLoading: isUserListLoading,
    mutateUsers,
  } = useUsers({
    ...userQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryUserShow = () => {
    setIsQueryUserShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryUserReset = () => {
    resetPagination();
    queryUserForm.resetFields();
    setUserQueryParams(undefined);
    mutateUsers();
  };

  const onQueryUserFinish = async () => {
    const values = queryUserForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryUser = values as ListUsersRequest;
    const filteredQueryUser = Object.fromEntries(
      Object.entries(queryUser).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setUserQueryParams(filteredQueryUser as ListUsersRequest);
  };

  // 分配角色模块
  const [isAssignRoleModalVisible, setIsAssignRoleModalVisible] =
    useState(false);
  const [isAssignRoleLoading, setIsAssignRoleLoading] = useState(false);
  const [assignRoleForm] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const initRequestData: ListUserRolesRequest = {
    current: 1,
    page_size: 1000,
  };
  const { roles: availableRoles } = useRoles(initRequestData);

  const onAssignRole = (user: User) => {
    setCurrentUser(user);
    setIsAssignRoleModalVisible(true);
  };

  const handleAssignRoleCancel = () => {
    assignRoleForm.resetFields();
    setIsAssignRoleModalVisible(false);
    setCurrentUser(null);
  };

  const handleAssignRoleFinish = async (values: { roles: string[] }) => {
    if (!currentUser) return;

    setIsAssignRoleLoading(true);
    try {
      await assignUserRoles({
        user_id: currentUser.id,
        role_ids: values.roles,
      });
      message.success('角色分配成功');
      mutateUsers();
      handleAssignRoleCancel();
    } finally {
      setIsAssignRoleLoading(false);
    }
  };

  // 表格列信息
  const userColumns: ColumnsType<User> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: User, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '头像地址',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const values =
          text !== undefined && text !== null ? String(text).split(',') : [];
        return values.map((value, index) => {
          const item = dictData['user_status'].find((d) => d.value === value);
          if (item) {
            const content = <span key={item.value}>{item.label}</span>;
            return index < values.length - 1 ? (
              <React.Fragment key={`${item.value}-with-comma`}>
                {content},&nbsp;
              </React.Fragment>
            ) : (
              content
            );
          }
          return null;
        });
      },
      width: '6%',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
      width: '14%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        if (record.id.toString() === '9') {
          return null;
        }

        return (
          <div className="flex gap-2 items-center justify-center">
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-operation"
              onClick={() => onUpdateUser(record)}
            >
              <PenLine className="w-3 h-3" />
              编辑
            </button>
            <Popconfirm
              title="确认删除"
              description="确定删除吗? 删除后将无法找回"
              onConfirm={() => handleDeleteUser(record)}
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
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-operation"
              onClick={() => onAssignRole(record)}
            >
              <CheckCircle2 className="w-3 h-3" />
              分配角色
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
        );
      },
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    userColumns.map((col) => col.key),
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
  const filteredUserColumns = userColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateUserModalVisible, setIsCreateUserModalVisible] =
    useState(false);
  const [isCreateUserLoading, setIsCreateUserLoading] = useState(false);
  const [createUserForm] = Form.useForm();

  const onCreateUser = () => {
    setIsCreateUserModalVisible(true);
  };
  const handleCreateUserCancel = () => {
    createUserForm.resetFields();
    setIsCreateUserModalVisible(false);
  };
  const handleCreateUserFinish = async (data: CreateUser) => {
    setIsCreateUserLoading(true);
    try {
      await createUser({ user: data });
      message.success('新增成功');
      createUserForm.resetFields();
      setIsCreateUserModalVisible(false);
      mutateUsers();
    } finally {
      setIsCreateUserLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteUser = async (user: User) => {
    await deleteUser(user.id);
    message.success('删除成功');
    mutateUsers();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: User[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleUserBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteUser({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateUsers();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleUserBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateUserModalVisible, setIsUpdateUserModalVisible] =
    useState<boolean>(false);
  const [isUpdateUserLoading, setIsUpdateUserLoading] =
    useState<boolean>(false);
  const [updateUserForm] = Form.useForm();

  const onUpdateUser = (user: User) => {
    setIsUpdateUserModalVisible(true);
    setSelectedRowKeys([user.id]);
    setSelectedRows([user]);
    updateUserForm.setFieldsValue({ ...user });
  };

  const handleUpdateUserCancel = () => {
    resetSelectedRows();
    updateUserForm.resetFields();
    setIsUpdateUserModalVisible(false);
  };

  const handleUpdateUserFinish = async () => {
    const updateUserData =
      (await updateUserForm.validateFields()) as UpdateUser;
    const req = { ...updateUserData, id: selectedRows[0].id };
    setIsUpdateUserLoading(true);
    try {
      await updateUser({ user: req });
      updateUserForm.resetFields();
      message.success('更新成功');
      mutateUsers();
      resetSelectedRows();
    } finally {
      setIsUpdateUserLoading(false);
      setIsUpdateUserModalVisible(false);
    }
  };

  // 批量更新模块
  const onUserBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateUserModalVisible(true);
      updateUserForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsBatchUpdateUsersModalVisible(true);
      batchUpdateUsersForm.resetFields();
    }
  };
  const [isBatchUpdateUsersModalVisible, setIsBatchUpdateUsersModalVisible] =
    useState<boolean>(false);
  const [isBatchUpdateUsersLoading, setIsBatchUpdateUsersLoading] =
    useState<boolean>(false);
  const [batchUpdateUsersForm] = Form.useForm();

  const handleBatchUpdateUsersCancel = async () => {
    batchUpdateUsersForm.resetFields();
    setIsBatchUpdateUsersModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };

  const handleBatchUpdateUsersFinish = async () => {
    const userBatchModify =
      (await batchUpdateUsersForm.validateFields()) as BatchUpdateUser;
    setIsBatchUpdateUsersLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateUsers({ ids: ids, user: userBatchModify });
      batchUpdateUsersForm.resetFields();
      message.success('更新成功');
      mutateUsers();
      resetSelectedRows();
    } finally {
      setIsBatchUpdateUsersLoading(false);
      setIsBatchUpdateUsersModalVisible(false);
    }
  };

  // 导入模块
  const [isImportUserModalVisible, setIsImportUserModalVisible] =
    useState<boolean>(false);
  const [isImportUserLoading, setIsImportUserLoading] =
    useState<boolean>(false);
  const [createUserList, setCreateUserList] = useState<CreateUser[]>([]);

  const onImportUser = () => {
    setIsImportUserModalVisible(true);
  };

  const handleImportUserCancel = () => {
    setIsImportUserModalVisible(false);
  };

  const onImportUserFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportUserLoading(true);
      const createUserList = await importUser({ file: fileList[0] });
      setCreateUserList(createUserList.users);
      return createUserList;
    } finally {
      setIsImportUserLoading(false);
    }
  };

  const handleImportUser = async () => {
    setIsImportUserLoading(true);
    try {
      await batchCreateUsers({ users: createUserList });
      message.success('导入成功');
      setIsImportUserModalVisible(false);
      mutateUsers();
    } finally {
      setIsImportUserLoading(false);
      setCreateUserList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onUserExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportUser({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryUserShow}>
        <QueryUserComponent
          onQueryUserFinish={onQueryUserFinish}
          onQueryUserReset={handleQueryUserReset}
          onQueryUserForm={queryUserForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateUser}
          onImport={onImportUser}
          onExport={onUserExport}
          onBatchModify={onUserBatchModify}
          onConfirmBatchRemove={handleUserBatchRemove}
          onConfirmBatchRemoveCancel={handleUserBatchRemoveCancel}
          isQueryShow={isQueryUserShow}
          onQueryShow={onQueryUserShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={userColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<User>
          columns={filteredUserColumns}
          dataSource={userListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isUserListLoading}
        />
      </div>
      <div>
        <div>
          <CreateUserComponent
            isCreateUserModalVisible={isCreateUserModalVisible}
            onCreateUserCancel={handleCreateUserCancel}
            onCreateUserFinish={handleCreateUserFinish}
            isCreateUserLoading={isCreateUserLoading}
            createUserForm={createUserForm}
          />
        </div>
        <div>
          <UpdateUserComponent
            isUpdateUserModalVisible={isUpdateUserModalVisible}
            onUpdateUserCancel={handleUpdateUserCancel}
            onUpdateUserFinish={handleUpdateUserFinish}
            isUpdateUserLoading={isUpdateUserLoading}
            updateUserForm={updateUserForm}
          />
        </div>
        <div>
          <BatchUpdateUserComponent
            isBatchUpdateUsersModalVisible={isBatchUpdateUsersModalVisible}
            onBatchUpdateUsersCancel={handleBatchUpdateUsersCancel}
            onBatchUpdateUsersFinish={handleBatchUpdateUsersFinish}
            isBatchUpdateUsersLoading={isBatchUpdateUsersLoading}
            batchUpdateUsersForm={batchUpdateUsersForm}
          />
        </div>

        <div>
          <ImportUserComponent
            isImportUserModalVisible={isImportUserModalVisible}
            isImportUserLoading={isImportUserLoading}
            onImportUserFinish={onImportUserFinish}
            onImportUserCancel={handleImportUserCancel}
            handleImportUser={handleImportUser}
          />
        </div>

        {/* 分配角色模态框 */}
        <Modal
          title="分配角色"
          open={isAssignRoleModalVisible}
          onCancel={handleAssignRoleCancel}
          footer={null}
        >
          <Form
            form={assignRoleForm}
            name="assign_role_form"
            onFinish={handleAssignRoleFinish}
            {...formItemLayout}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                disabled
                value={currentUser?.username || ''}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input
                disabled
                value={currentUser?.nickname || ''}
                placeholder="昵称"
              />
            </Form.Item>
            <Form.Item
              name="roles"
              label="角色"
              rules={[{ required: true, message: '请选择至少一个角色' }]}
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择角色"
                optionFilterProp="label"
              >
                {availableRoles?.map((role) => (
                  <Select.Option
                    key={role.id}
                    value={role.id}
                    label={role.name}
                  >
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isAssignRoleLoading}
              >
                确定
              </Button>
              <Button
                onClick={handleAssignRoleCancel}
                style={{ marginLeft: 8 }}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserPage;
