import ActionButtonComponent from "@/components/base/action-button";
import { PaginatedTable } from "@/components/base/paginated-table";
import { message } from "@/components/GlobalToast";
import {
  batchCreateUserRole,
  batchModifyUserRole,
  batchRemoveUserRole,
  createUserRole,
  exportUserRolePage,
  fetchUserRoleByPage,
  fetchUserRoleDetail,
  importUserRole,
  modifyUserRole,
  removeUserRole,
} from "@/service/user-role";
import { BaseQueryImpl } from "@/types";
import { UserRoleBatchModify, UserRoleCreate, UserRoleDetail, UserRoleModify, UserRolePage, UserRoleQuery } from "@/types/user-role";
import UserRoleBatchModifyComponent from "@/views/system/user-role/components/user-role-batch-modify";
import UserRoleCreateComponent from "@/views/system/user-role/components/user-role-create";
import UserRoleImportComponent from "@/views/system/user-role/components/user-role-import";
import UserRoleModifyComponent from "@/views/system/user-role/components/user-role-modify";
import UserRoleQueryComponent from "@/views/system/user-role/components/user-role-query";
import { Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import type { RcFile } from "rc-upload/lib/interface";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import UserRoleDetailComponent from "@/views/system/user-role/components/user-role-detail";
import TransitionWrapper from '@/components/base/transition-wrapper';

const UserRole: React.FC = () => {
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
  const [isUserRoleQueryShow, setIsUserRoleQueryShow] = useState<boolean>(true)
  const [userRolePageDataSource, setUserRolePageDataSource] = useState<UserRolePage[]>([]);
  const [userRolePageTotalCount, setUserRolePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onUserRoleQueryShow = () => {
    setIsUserRoleQueryShow(prevState => !prevState)
  }
  useEffect(() => {
    const fetchData = async () => {
      const userRoleQuery = (await userRoleQueryForm.validateFields()) as UserRoleQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchUserRoleByPage(pageData, userRoleQuery);
      setUserRolePageDataSource(resp.records);
      setUserRolePageTotalCount(resp.total);
    };
    fetchData().then(() => {
    });
  }, [current, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };
  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  // 详情模块
  const [isUserRoleDetailDrawerVisible, setIsUserRoleDetailDrawerVisible] = useState<boolean>(false);
  const [userRoleDetail, setUserRoleDetail] = useState<UserRoleDetail | null>(null);
  const onUserRoleDetail = async (userRolePage: UserRolePage) => {
    setIsUserRoleDetailDrawerVisible(true);
    const id = userRolePage.id;
    await fetchUserRoleDetail(id).then(setUserRoleDetail);
  };

  const onUserRoleDetailClose = async () => {
    setUserRoleDetail(null);
    setIsUserRoleDetailDrawerVisible(false);
  };

  // 表格列信息
  const userRolePageColumns: ColumnsType<UserRolePage> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: UserRolePage, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "角色ID",
      dataIndex: "role_id",
      key: "role_id",
      render: (text) => (text ? text : "-"),
      width: "6%",
    },
    {
      title: "创建者",
      dataIndex: "creator",
      key: "creator",
      render: (text) => (text ? text : "-"),
      ellipsis: true,
      width: "12%",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text) => (text ? text : "-"),
      ellipsis: true,
      width: "12%",
    },
    {
      title: "更新者",
      dataIndex: "updater",
      key: "updater",
      render: (text) => (text ? text : "-"),
      ellipsis: true,
      width: "12%",
    },
    {
      title: "",
      dataIndex: "deleted",
      key: "deleted",
      render: (text) => (text ? text : "-"),
      ellipsis: true,
      width: "12%",
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
            onClick={ () => onMenuDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onMenuModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleMenuDelete(record)}
          >
            <DeleteOutlined className="w-3 h-3" />
            删除
          </button>

          {showMore && (
            <button type="button" className="flex items-center gap-0.5 text-xs btn-operation">
              <span>更多</span>
              <MoreOutlined className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState(userRolePageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredUserRoleColumns = userRolePageColumns.filter(col => visibleColumns.includes(col.key));

  const [userRoleQueryForm] = Form.useForm();
  const handleUserRoleQueryReset = () => {
    resetPagination();
    userRoleQueryForm.resetFields();
  };
  const onUserRoleQueryFinish = async () => {
    const userRoleQueryFormData = userRoleQueryForm.getFieldsValue();
    const { create_time } = userRoleQueryFormData
    if (create_time) {
      const [startDate, endDate] = create_time
      userRoleQueryFormData.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    const userRoleQuery = userRoleQueryFormData as UserRoleQuery;
    const filteredUserRoleQuery = Object.fromEntries(
      Object.entries(userRoleQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleUserRoleQueryFinish(filteredUserRoleQuery as UserRoleQuery);
  };
  const handleUserRoleQueryFinish = async (userRoleQuery: UserRoleQuery) => {
    await fetchUserRoleByPage(BaseQueryImpl.create(current, pageSize), userRolePage).then((resp) => {
      setUserRolePageDataSource(resp.records);
      setUserRolePageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isUserRoleCreateModalVisible, setIsUserRoleCreateModalVisible] = useState(false);
  const [isUserRoleCreateLoading, setIsUserRoleCreateLoading] = useState(false);
  const [userRoleCreateForm] = Form.useForm();
  const onUserRoleCreate = () => {
    setIsUserRoleCreateModalVisible(true);
  };
  const handleUserRoleCreateCancel = () => {
    userRoleCreateForm.resetFields();
    setIsUserRoleCreateModalVisible(false);
  };
  const handleUserRoleCreateFinish = async (userRoleCreate: UserRoleCreate) => {
    setIsUserRoleCreateLoading(true);
    try {
      await createUserRole(userRoleCreate);
      message.success("新增成功");
      userRoleCreateForm.resetFields();
      await onUserRoleQueryFinish();
    } finally {
      setIsUserRoleCreateLoading(false);
      setIsUserRoleCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleUserRoleDelete = async (userRolePage: UserRolePage) => {
    await removeUserRole(userRolePage.id);
    await onUserRoleQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserRolePage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: UserRolePage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleUserRoleBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveUserRole(selectedRows.map((row) => row.id));
      await onUserRoleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleUserRoleBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isUserRoleModifyModalVisible, setIsUserRoleModifyModalVisible] = useState<boolean>(false);
  const [isUserRoleModifyLoading, setIsUserRoleModifyLoading] = useState<boolean>(false);
  const [userRoleModifyForm] = Form.useForm();
  const onUserRoleModify = (userRolePage: UserRolePage) => {
    setIsUserRoleModifyModalVisible(true);
    setSelectedRowKeys([userRolePage.id])
    setSelectedRows([userRolePage])
    userRoleModifyForm.setFieldsValue({ ...userRolePage });
  };

  const handleUserRoleModifyCancel = () => {
    resetSelectedRows();
    userRoleModifyForm.resetFields();
    setIsUserRoleModifyModalVisible(false);
  };
  const handleUserRoleModifyFinish = async () => {
    const userRoleModifyData = (await userRoleModifyForm.validateFields()) as UserRoleModify;
    const userRoleModify = {...userRoleModifyData, id: selectedRows[0].id};
    setIsUserRoleModifyLoading(true);
    try {
      await modifyUserRole(userRoleModify);
      userRoleModifyForm.resetFields();
      message.success("更新成功");
      await onUserRoleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsUserRoleModifyLoading(false);
      setIsUserRoleModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onUserRoleBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUserRoleModifyModalVisible(true);
      userRoleModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsUserRoleBatchModifyModalVisible(true);
      userRoleBatchModifyForm.resetFields();
    }
  };
  const [isUserRoleBatchModifyModalVisible, setIsUserRoleBatchModifyModalVisible] = useState<boolean>(false);
  const [isUserRoleBatchModifyLoading, setIsUserRoleBatchModifyLoading] = useState<boolean>(false);
  const [userRoleBatchModifyForm] = Form.useForm();
  const handleUserRoleBatchModifyCancel = async () => {
    userRoleBatchModifyForm.resetFields();
    setIsUserRoleBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleUserRoleBatchModifyFinish = async () => {
    const userRoleBatchModify = (await userRoleBatchModifyForm.validateFields()) as UserRoleBatchModify;
    setIsUserRoleBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      userRoleBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyUserRole(userRoleBatchModify);
      userRoleBatchModifyForm.resetFields();
      message.success("更新成功");
      await onUserRoleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsUserRoleBatchModifyLoading(false);
      setIsUserRoleBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isUserRoleImportModalVisible, setIsUserRoleImportModalVisible] = useState<boolean>(false);
  const [isUserRoleImportLoading, setIsUserRoleImportLoading] = useState<boolean>(false);
  const [userRoleCreateList, setUserRoleCreateList] = useState<UserRoleCreate[]>([]);

  const onUserRoleImport = () => {
    setIsUserRoleImportModalVisible(true);
  };
  const handleUserRoleImportCancel = () => {
    setIsUserRoleImportModalVisible(false);
  };
  const onUserRoleImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsUserRoleImportLoading(true);
      const userRoleCreateList = await importUserRole(fileList[0]);
      setUserRoleCreateList(userRoleCreateList);
      return userRoleCreateList;
    } finally {
      setIsUserRoleImportLoading(false);
    }
  };

  const handleUserRoleImport = async () => {
    setIsUserRoleImportLoading(true);
    try {
      await batchCreateUserRole(userRoleCreateList);
      message.success("导入成功");
      setIsUserRoleImportModalVisible(false);
      await onUserRoleQueryFinish();
    } finally {
      setIsUserRoleImportLoading(false);
      setUserRoleCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onUserRoleExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportUserRolePage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isUserRoleQueryShow}>
        <div className="shadow-sm">
          <UserRoleQueryComponent
            onUserRoleQueryFinish={onUserRoleQueryFinish}
            onUserRoleQueryReset={handleUserRoleQueryReset}
            userRoleQueryForm={ userRoleQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onUserRoleCreate}
          onImport={onUserRoleImport}
          onExport={onUserRoleExport}
          onBatchModify={onUserRoleBatchModify}
          onConfirmBatchRemove={handleUserRoleBatchRemove}
          onConfirmBatchRemoveCancel={handleUserRoleBatchRemoveCancel}
          isQueryShow={isUserRoleQueryShow}
          onQueryShow={onUserRoleQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ userRolePageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<UserRolePage>
          columns={ filteredUserRoleColumns}
          dataSource={ userRolePageDataSource}
          total={ userRolePageTotalCount}
          current={current}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
        />
      </div>
      <div>
        <div>
          <UserRoleCreateComponent
            isUserRoleCreateModalVisible={isUserRoleCreateModalVisible}
            onUserRoleCreateCancel={handleUserRoleCreateCancel}
            onUserRoleCreateFinish={handleUserRoleCreateFinish}
            isUserRoleCreateLoading={isUserRoleCreateLoading}
            userRoleCreateForm={ userRoleCreateForm}
          />
        </div>
        <div>
          <UserRoleDetailComponent
            isUserRoleDetailDrawerVisible={isUserRoleDetailDrawerVisible}
            onUserRoleDetailClose={onUserRoleDetailClose}
            userRoleDetail={ userRoleDetail}
          />
        </div>
        <div>
          <UserRoleModifyComponent
            isUserRoleModifyModalVisible={isUserRoleModifyModalVisible}
            onUserRoleModifyCancel={handleUserRoleModifyCancel}
            onUserRoleModifyFinish={handleUserRoleModifyFinish}
            isUserRoleModifyLoading={isUserRoleModifyLoading}
            userRoleModifyForm={ userRoleModifyForm}
          />
        </div>
        <div>
          <UserRoleBatchModifyComponent
            isUserRoleBatchModifyModalVisible={isUserRoleBatchModifyModalVisible}
            onUserRoleBatchModifyCancel={handleUserRoleBatchModifyCancel}
            onUserRoleBatchModifyFinish={handleUserRoleBatchModifyFinish}
            isUserRoleBatchModifyLoading={isUserRoleBatchModifyLoading}
            userRoleBatchModifyForm={ userRoleBatchModifyForm}
          />
        </div>
        <div>
          <UserRoleImportComponent
            isUserRoleImportModalVisible={isUserRoleImportModalVisible}
            isUserRoleImportLoading={isUserRoleImportLoading}
            onUserRoleImportFinish={onUserRoleImportFinish}
            onUserRoleImportCancel={handleUserRoleImportCancel}
            handleUserRoleImport={handleUserRoleImport}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRole;