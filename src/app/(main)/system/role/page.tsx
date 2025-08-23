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
  batchDeleteRole,
  createRole,
  deleteRole,
  updateRole,
  useRoles,
} from '@/service/role';
import { createPaginationRequest } from '@/types';
import { CreateRole, ListRolesRequest, Role, UpdateRole } from '@/types/role';
import { Form, message, Popconfirm, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { format } from 'date-fns';
import { MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import CreateRoleComponent from './components/create-role';
import QueryRoleComponent from './components/query-role';
import UpdateRoleComponent from './components/update-role';

const RolePage: React.FC = () => {
  // 配置模块
  const actionConfig = {
    showCreate: true,
    showImport: false,
    showExport: false,
    showModify: false,
    showRemove: true,
  };
  const showMore = false;

  // 查询模块
  const [isQueryRoleShow, setIsQueryRoleShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryRoleForm] = Form.useForm();
  const [roleQueryParams, setRoleQueryParams] = useState<ListRolesRequest>();

  // 用 useRoles 获取菜单列表数据
  const {
    roles: roleListDataSource,
    total,
    isLoading: isRoleListLoading,
    mutateRoles,
  } = useRoles({
    ...roleQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryRoleShow = () => {
    setIsQueryRoleShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryRoleReset = () => {
    resetPagination();
    queryRoleForm.resetFields();
    setRoleQueryParams(undefined);
    mutateRoles();
  };

  const onQueryRoleFinish = async () => {
    const values = queryRoleForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryRole = values as ListRolesRequest;
    const filteredQueryRole = Object.fromEntries(
      Object.entries(queryRole).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setRoleQueryParams(filteredQueryRole as ListRolesRequest);
  };

  // 表格列信息
  const roleColumns: ColumnsType<Role> = [
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
      render: (_: number, _record: Role, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '权限标识',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      key: 'sort',
      width: '8%',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (text) => {
        if (text === 1) {
          return <Tag color="success">正常</Tag>;
        }
        return <Tag color="error">停用</Tag>;
      },
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
            onClick={() => onUpdateRole(record)}
          >
            <PenLine className="w-3 h-3" />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteRole(record)}
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
    roleColumns.map((col) => col.key),
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
  const filteredRoleColumns = roleColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateRoleModalVisible, setIsCreateRoleModalVisible] =
    useState(false);
  const [isCreateRoleLoading, setIsCreateRoleLoading] = useState(false);
  const [createRoleForm] = Form.useForm();

  const onCreateRole = () => {
    setIsCreateRoleModalVisible(true);
  };
  const handleCreateRoleCancel = () => {
    createRoleForm.resetFields();
    setIsCreateRoleModalVisible(false);
  };
  const handleCreateRoleFinish = async (data: CreateRole) => {
    setIsCreateRoleLoading(true);
    try {
      await createRole({ role: data });
      message.success('新增成功');
      createRoleForm.resetFields();
      setIsCreateRoleModalVisible(false);
      mutateRoles();
    } finally {
      setIsCreateRoleLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteRole = async (role: Role) => {
    await deleteRole(role.id);
    message.success('删除成功');
    mutateRoles();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Role[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Role[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleRoleBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteRole({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateRoles();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleRoleBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateRoleModalVisible, setIsUpdateRoleModalVisible] =
    useState<boolean>(false);
  const [isUpdateRoleLoading, setIsUpdateRoleLoading] =
    useState<boolean>(false);
  const [updateRoleForm] = Form.useForm();

  const onUpdateRole = (role: Role) => {
    setIsUpdateRoleModalVisible(true);
    setSelectedRowKeys([role.id]);
    setSelectedRows([role]);
  };

  const handleUpdateRoleCancel = () => {
    resetSelectedRows();
    updateRoleForm.resetFields();
    setIsUpdateRoleModalVisible(false);
  };

  const handleUpdateRoleFinish = async (data: UpdateRole) => {
    setIsUpdateRoleLoading(true);
    try {
      const operation_type =
        typeof data.operation_type === 'string'
          ? data.operation_type.split(',')
          : data.operation_type;
      const req = { ...data, id: selectedRows[0].id, operation_type };
      await updateRole({ role: req });
      message.success('更新成功');
      mutateRoles();
      resetSelectedRows();
      setIsUpdateRoleModalVisible(false);
    } finally {
      setIsUpdateRoleLoading(false);
    }
  };
  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryRoleShow}>
        <QueryRoleComponent
          onQueryRoleFinish={onQueryRoleFinish}
          onQueryRoleReset={handleQueryRoleReset}
          onQueryRoleForm={queryRoleForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateRole}
          onImport={() => {}}
          onExport={() => {}}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleRoleBatchRemove}
          onConfirmBatchRemoveCancel={handleRoleBatchRemoveCancel}
          isQueryShow={isQueryRoleShow}
          onQueryShow={onQueryRoleShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={false}
          rawColumns={roleColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<Role>
          columns={filteredRoleColumns}
          dataSource={roleListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isRoleListLoading}
          className="min-h-96"
        />
      </div>
      <div>
        <div>
          <CreateRoleComponent
            isCreateRoleModalVisible={isCreateRoleModalVisible}
            onCreateRoleCancel={handleCreateRoleCancel}
            onCreateRoleFinish={handleCreateRoleFinish}
            isCreateRoleLoading={isCreateRoleLoading}
            createRoleForm={createRoleForm}
          />
        </div>
        <div>
          <UpdateRoleComponent
            isUpdateRoleModalVisible={isUpdateRoleModalVisible}
            onUpdateRoleCancel={handleUpdateRoleCancel}
            onUpdateRoleFinish={handleUpdateRoleFinish}
            isUpdateRoleLoading={isUpdateRoleLoading}
            updateRoleForm={updateRoleForm}
            roleId={selectedRows[0]?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default RolePage;
