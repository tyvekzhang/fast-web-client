'use client';
import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import { message } from '@/components/GlobalToast';
import {
  batchCreateRole,
  batchModifyRole,
  batchRemoveRole,
  createRole,
  exportRolePage,
  fetchRoleByPage,
  fetchRoleDetail,
  importRole,
  modifyRole,
  removeRole,
} from '@/service/role';
import { BaseQueryImpl } from '@/types';
import {
  RoleBatchModify,
  RoleCreate,
  RoleDetail,
  RoleModify,
  RolePage,
  RoleQuery,
} from '@/types/role';
import { Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  Trash2 as DeleteOutlined,
  PenLine as EditOutlined,
  Eye as EyeOutlined,
  MoreHorizontal as MoreOutlined,
} from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import RoleBatchModifyComponent from './components/role-batch-modify';
import RoleCreateComponent from './components/role-create';
import RoleDetailComponent from './components/role-detail';
import RoleImportComponent from './components/role-import';
import RoleModifyComponent from './components/role-modify';
import RoleQueryComponent from './components/role-query';

const Role: React.FC = () => {
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
  const [isRoleQueryShow, setIsRoleQueryShow] = useState<boolean>(true);
  const [rolePageDataSource, setRolePageDataSource] = useState<RolePage[]>([]);
  const [rolePageTotalCount, setRolePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const onRoleQueryShow = () => {
    setIsRoleQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const roleQuery = (await roleQueryForm.validateFields()) as RoleQuery;
      const pageData = BaseQueryImpl.create(current, page_size);
      const resp = await fetchRoleByPage(pageData, roleQuery);
      setRolePageDataSource(resp.records);
      setRolePageTotalCount(resp.total);
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
  const [isRoleDetailDrawerVisible, setIsRoleDetailDrawerVisible] =
    useState<boolean>(false);
  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null);
  const onRoleDetail = async (rolePage: RolePage) => {
    setIsRoleDetailDrawerVisible(true);
    const id = rolePage.id;
    await fetchRoleDetail(id).then(setRoleDetail);
  };

  const onRoleDetailClose = async () => {
    setRoleDetail(null);
    setIsRoleDetailDrawerVisible(false);
  };

  // 表格列信息
  const rolePageColumns: ColumnsType<RolePage> = [
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
      render: (_: number, _record: RolePage, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '角色权限字符串',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text) => (text ? text : '-'),
      width: '6%',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text ? text : '-'),
      width: '6%',
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
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
            onClick={() => onRoleDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onRoleModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={() => handleRoleDelete(record)}
          >
            <DeleteOutlined className="w-3 h-3" />
            删除
          </button>

          {showMore && (
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-operation"
            >
              <span>更多</span>
              <MoreOutlined className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    rolePageColumns.map((col) => col.key),
  );
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter((key) => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredRoleColumns = rolePageColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [roleQueryForm] = Form.useForm();
  const handleRoleQueryReset = () => {
    resetPagination();
    roleQueryForm.resetFields();
  };
  const onRoleQueryFinish = async () => {
    const roleQueryFormData = roleQueryForm.getFieldsValue();
    const { create_time } = roleQueryFormData;
    if (create_time) {
      const [startDate, endDate] = create_time;
      roleQueryFormData.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const roleQuery = roleQueryFormData as RoleQuery;
    const filteredRoleQuery = Object.fromEntries(
      Object.entries(roleQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleRoleQueryFinish(filteredRoleQuery as RoleQuery);
  };
  const handleRoleQueryFinish = async (roleQuery: RoleQuery) => {
    await fetchRoleByPage(
      BaseQueryImpl.create(current, page_size),
      roleQuery,
    ).then((resp) => {
      setRolePageDataSource(resp.records);
      setRolePageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isRoleCreateModalVisible, setIsRoleCreateModalVisible] =
    useState(false);
  const [isRoleCreateLoading, setIsRoleCreateLoading] = useState(false);
  const [roleCreateForm] = Form.useForm();
  const onRoleCreate = () => {
    setIsRoleCreateModalVisible(true);
  };
  const handleRoleCreateCancel = () => {
    roleCreateForm.resetFields();
    setIsRoleCreateModalVisible(false);
  };
  const handleRoleCreateFinish = async (roleCreate: RoleCreate) => {
    setIsRoleCreateLoading(true);
    try {
      await createRole(roleCreate);
      message.success('新增成功');
      roleCreateForm.resetFields();
      await onRoleQueryFinish();
    } finally {
      setIsRoleCreateLoading(false);
      setIsRoleCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleRoleDelete = async (rolePage: RolePage) => {
    await removeRole(rolePage.id);
    await onRoleQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RolePage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: RolePage[],
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
      await batchRemoveRole(selectedRows.map((row) => row.id));
      await onRoleQueryFinish();
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
  const [isRoleModifyModalVisible, setIsRoleModifyModalVisible] =
    useState<boolean>(false);
  const [isRoleModifyLoading, setIsRoleModifyLoading] =
    useState<boolean>(false);
  const [roleModifyForm] = Form.useForm();
  const onRoleModify = (rolePage: RolePage) => {
    setIsRoleModifyModalVisible(true);
    setSelectedRowKeys([rolePage.id]);
    setSelectedRows([rolePage]);
    roleModifyForm.setFieldsValue({ ...rolePage });
  };

  const handleRoleModifyCancel = () => {
    resetSelectedRows();
    roleModifyForm.resetFields();
    setIsRoleModifyModalVisible(false);
  };
  const handleRoleModifyFinish = async () => {
    const roleModifyData =
      (await roleModifyForm.validateFields()) as RoleModify;
    const roleModify = { ...roleModifyData, id: selectedRows[0].id };
    setIsRoleModifyLoading(true);
    try {
      await modifyRole(roleModify);
      roleModifyForm.resetFields();
      message.success('更新成功');
      await onRoleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsRoleModifyLoading(false);
      setIsRoleModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onRoleBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsRoleModifyModalVisible(true);
      roleModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsRoleBatchModifyModalVisible(true);
      roleBatchModifyForm.resetFields();
    }
  };
  const [isRoleBatchModifyModalVisible, setIsRoleBatchModifyModalVisible] =
    useState<boolean>(false);
  const [isRoleBatchModifyLoading, setIsRoleBatchModifyLoading] =
    useState<boolean>(false);
  const [roleBatchModifyForm] = Form.useForm();
  const handleRoleBatchModifyCancel = async () => {
    roleBatchModifyForm.resetFields();
    setIsRoleBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };
  const handleRoleBatchModifyFinish = async () => {
    const roleBatchModify =
      (await roleBatchModifyForm.validateFields()) as RoleBatchModify;
    setIsRoleBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      roleBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyRole(roleBatchModify);
      roleBatchModifyForm.resetFields();
      message.success('更新成功');
      await onRoleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsRoleBatchModifyLoading(false);
      setIsRoleBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isRoleImportModalVisible, setIsRoleImportModalVisible] =
    useState<boolean>(false);
  const [isRoleImportLoading, setIsRoleImportLoading] =
    useState<boolean>(false);
  const [roleCreateList, setRoleCreateList] = useState<RoleCreate[]>([]);

  const onRoleImport = () => {
    setIsRoleImportModalVisible(true);
  };
  const handleRoleImportCancel = () => {
    setIsRoleImportModalVisible(false);
  };
  const onRoleImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsRoleImportLoading(true);
      const roleCreateList = await importRole(fileList[0]);
      setRoleCreateList(roleCreateList);
      return roleCreateList;
    } finally {
      setIsRoleImportLoading(false);
    }
  };

  const handleRoleImport = async () => {
    setIsRoleImportLoading(true);
    try {
      await batchCreateRole(roleCreateList);
      message.success('导入成功');
      setIsRoleImportModalVisible(false);
      await onRoleQueryFinish();
    } finally {
      setIsRoleImportLoading(false);
      setRoleCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onRoleExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportRolePage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isRoleQueryShow}>
        <div className="shadow-sm">
          <RoleQueryComponent
            onRoleQueryFinish={onRoleQueryFinish}
            onRoleQueryReset={handleRoleQueryReset}
            roleQueryForm={roleQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onRoleCreate}
          onImport={onRoleImport}
          onExport={onRoleExport}
          onBatchModify={onRoleBatchModify}
          onConfirmBatchRemove={handleRoleBatchRemove}
          onConfirmBatchRemoveCancel={handleRoleBatchRemoveCancel}
          isQueryShow={isRoleQueryShow}
          onQueryShow={onRoleQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={rolePageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<RolePage>
          columns={filteredRoleColumns}
          dataSource={rolePageDataSource}
          total={rolePageTotalCount}
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
          <RoleCreateComponent
            isRoleCreateModalVisible={isRoleCreateModalVisible}
            onRoleCreateCancel={handleRoleCreateCancel}
            onRoleCreateFinish={handleRoleCreateFinish}
            isRoleCreateLoading={isRoleCreateLoading}
            roleCreateForm={roleCreateForm}
          />
        </div>
        <div>
          <RoleDetailComponent
            isRoleDetailDrawerVisible={isRoleDetailDrawerVisible}
            onRoleDetailClose={onRoleDetailClose}
            roleDetail={roleDetail}
          />
        </div>
        <div>
          <RoleModifyComponent
            isRoleModifyModalVisible={isRoleModifyModalVisible}
            onRoleModifyCancel={handleRoleModifyCancel}
            onRoleModifyFinish={handleRoleModifyFinish}
            isRoleModifyLoading={isRoleModifyLoading}
            roleModifyForm={roleModifyForm}
          />
        </div>
        <div>
          <RoleBatchModifyComponent
            isRoleBatchModifyModalVisible={isRoleBatchModifyModalVisible}
            onRoleBatchModifyCancel={handleRoleBatchModifyCancel}
            onRoleBatchModifyFinish={handleRoleBatchModifyFinish}
            isRoleBatchModifyLoading={isRoleBatchModifyLoading}
            roleBatchModifyForm={roleBatchModifyForm}
          />
        </div>
        <div>
          <RoleImportComponent
            isRoleImportModalVisible={isRoleImportModalVisible}
            isRoleImportLoading={isRoleImportLoading}
            onRoleImportFinish={onRoleImportFinish}
            onRoleImportCancel={handleRoleImportCancel}
            handleRoleImport={handleRoleImport}
          />
        </div>
      </div>
    </div>
  );
};

export default Role;
