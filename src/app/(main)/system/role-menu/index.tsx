import ActionButtonComponent from "@/components/base/action-button";
import { PaginatedTable } from "@/components/base/paginated-table";
import { message } from "@/components/GlobalToast";
import {
  batchCreateRoleMenu,
  batchModifyRoleMenu,
  batchRemoveRoleMenu,
  createRoleMenu,
  exportRoleMenuPage,
  fetchRoleMenuByPage,
  fetchRoleMenuDetail,
  importRoleMenu,
  modifyRoleMenu,
  removeRoleMenu,
} from "@/service/role-menu";
import { BaseQueryImpl } from "@/types";
import { RoleMenuBatchModify, RoleMenuCreate, RoleMenuDetail, RoleMenuModify, RoleMenuPage, RoleMenuQuery } from "@/types/role-menu";
import RoleMenuBatchModifyComponent from "@/views/system/role-menu/components/role-menu-batch-modify";
import RoleMenuCreateComponent from "@/views/system/role-menu/components/role-menu-create";
import RoleMenuImportComponent from "@/views/system/role-menu/components/role-menu-import";
import RoleMenuModifyComponent from "@/views/system/role-menu/components/role-menu-modify";
import RoleMenuQueryComponent from "@/views/system/role-menu/components/role-menu-query";
import { Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import type { RcFile } from "rc-upload/lib/interface";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import RoleMenuDetailComponent from "@/views/system/role-menu/components/role-menu-detail";
import TransitionWrapper from '@/components/base/transition-wrapper';

const RoleMenu: React.FC = () => {
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
  const [isRoleMenuQueryShow, setIsRoleMenuQueryShow] = useState<boolean>(true)
  const [roleMenuPageDataSource, setRoleMenuPageDataSource] = useState<RoleMenuPage[]>([]);
  const [roleMenuPageTotalCount, setRoleMenuPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onRoleMenuQueryShow = () => {
    setIsRoleMenuQueryShow(prevState => !prevState)
  }
  useEffect(() => {
    const fetchData = async () => {
      const roleMenuQuery = (await roleMenuQueryForm.validateFields()) as RoleMenuQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchRoleMenuByPage(pageData, roleMenuQuery);
      setRoleMenuPageDataSource(resp.records);
      setRoleMenuPageTotalCount(resp.total);
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
  const [isRoleMenuDetailDrawerVisible, setIsRoleMenuDetailDrawerVisible] = useState<boolean>(false);
  const [roleMenuDetail, setRoleMenuDetail] = useState<RoleMenuDetail | null>(null);
  const onRoleMenuDetail = async (roleMenuPage: RoleMenuPage) => {
    setIsRoleMenuDetailDrawerVisible(true);
    const id = roleMenuPage.id;
    await fetchRoleMenuDetail(id).then(setRoleMenuDetail);
  };

  const onRoleMenuDetailClose = async () => {
    setRoleMenuDetail(null);
    setIsRoleMenuDetailDrawerVisible(false);
  };

  // 表格列信息
  const roleMenuPageColumns: ColumnsType<RoleMenuPage> = [
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
      render: (_: number, _record: RoleMenuPage, rowIndex: number) => rowIndex + 1,
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
      title: "菜单ID",
      dataIndex: "menu_id",
      key: "menu_id",
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

  const [visibleColumns, setVisibleColumns] = useState(roleMenuPageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredRoleMenuColumns = roleMenuPageColumns.filter(col => visibleColumns.includes(col.key));

  const [roleMenuQueryForm] = Form.useForm();
  const handleRoleMenuQueryReset = () => {
    resetPagination();
    roleMenuQueryForm.resetFields();
  };
  const onRoleMenuQueryFinish = async () => {
    const roleMenuQueryFormData = roleMenuQueryForm.getFieldsValue();
    const { create_time } = roleMenuQueryFormData
    if (create_time) {
      const [startDate, endDate] = create_time
      roleMenuQueryFormData.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    const roleMenuQuery = roleMenuQueryFormData as RoleMenuQuery;
    const filteredRoleMenuQuery = Object.fromEntries(
      Object.entries(roleMenuQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleRoleMenuQueryFinish(filteredRoleMenuQuery as RoleMenuQuery);
  };
  const handleRoleMenuQueryFinish = async (roleMenuQuery: RoleMenuQuery) => {
    await fetchRoleMenuByPage(BaseQueryImpl.create(current, pageSize), roleMenuPage).then((resp) => {
      setRoleMenuPageDataSource(resp.records);
      setRoleMenuPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isRoleMenuCreateModalVisible, setIsRoleMenuCreateModalVisible] = useState(false);
  const [isRoleMenuCreateLoading, setIsRoleMenuCreateLoading] = useState(false);
  const [roleMenuCreateForm] = Form.useForm();
  const onRoleMenuCreate = () => {
    setIsRoleMenuCreateModalVisible(true);
  };
  const handleRoleMenuCreateCancel = () => {
    roleMenuCreateForm.resetFields();
    setIsRoleMenuCreateModalVisible(false);
  };
  const handleRoleMenuCreateFinish = async (roleMenuCreate: RoleMenuCreate) => {
    setIsRoleMenuCreateLoading(true);
    try {
      await createRoleMenu(roleMenuCreate);
      message.success("新增成功");
      roleMenuCreateForm.resetFields();
      await onRoleMenuQueryFinish();
    } finally {
      setIsRoleMenuCreateLoading(false);
      setIsRoleMenuCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleRoleMenuDelete = async (roleMenuPage: RoleMenuPage) => {
    await removeRoleMenu(roleMenuPage.id);
    await onRoleMenuQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RoleMenuPage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: RoleMenuPage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleRoleMenuBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveRoleMenu(selectedRows.map((row) => row.id));
      await onRoleMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleRoleMenuBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isRoleMenuModifyModalVisible, setIsRoleMenuModifyModalVisible] = useState<boolean>(false);
  const [isRoleMenuModifyLoading, setIsRoleMenuModifyLoading] = useState<boolean>(false);
  const [roleMenuModifyForm] = Form.useForm();
  const onRoleMenuModify = (roleMenuPage: RoleMenuPage) => {
    setIsRoleMenuModifyModalVisible(true);
    setSelectedRowKeys([roleMenuPage.id])
    setSelectedRows([roleMenuPage])
    roleMenuModifyForm.setFieldsValue({ ...roleMenuPage });
  };

  const handleRoleMenuModifyCancel = () => {
    resetSelectedRows();
    roleMenuModifyForm.resetFields();
    setIsRoleMenuModifyModalVisible(false);
  };
  const handleRoleMenuModifyFinish = async () => {
    const roleMenuModifyData = (await roleMenuModifyForm.validateFields()) as RoleMenuModify;
    const roleMenuModify = {...roleMenuModifyData, id: selectedRows[0].id};
    setIsRoleMenuModifyLoading(true);
    try {
      await modifyRoleMenu(roleMenuModify);
      roleMenuModifyForm.resetFields();
      message.success("更新成功");
      await onRoleMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsRoleMenuModifyLoading(false);
      setIsRoleMenuModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onRoleMenuBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsRoleMenuModifyModalVisible(true);
      roleMenuModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsRoleMenuBatchModifyModalVisible(true);
      roleMenuBatchModifyForm.resetFields();
    }
  };
  const [isRoleMenuBatchModifyModalVisible, setIsRoleMenuBatchModifyModalVisible] = useState<boolean>(false);
  const [isRoleMenuBatchModifyLoading, setIsRoleMenuBatchModifyLoading] = useState<boolean>(false);
  const [roleMenuBatchModifyForm] = Form.useForm();
  const handleRoleMenuBatchModifyCancel = async () => {
    roleMenuBatchModifyForm.resetFields();
    setIsRoleMenuBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleRoleMenuBatchModifyFinish = async () => {
    const roleMenuBatchModify = (await roleMenuBatchModifyForm.validateFields()) as RoleMenuBatchModify;
    setIsRoleMenuBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      roleMenuBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyRoleMenu(roleMenuBatchModify);
      roleMenuBatchModifyForm.resetFields();
      message.success("更新成功");
      await onRoleMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsRoleMenuBatchModifyLoading(false);
      setIsRoleMenuBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isRoleMenuImportModalVisible, setIsRoleMenuImportModalVisible] = useState<boolean>(false);
  const [isRoleMenuImportLoading, setIsRoleMenuImportLoading] = useState<boolean>(false);
  const [roleMenuCreateList, setRoleMenuCreateList] = useState<RoleMenuCreate[]>([]);

  const onRoleMenuImport = () => {
    setIsRoleMenuImportModalVisible(true);
  };
  const handleRoleMenuImportCancel = () => {
    setIsRoleMenuImportModalVisible(false);
  };
  const onRoleMenuImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsRoleMenuImportLoading(true);
      const roleMenuCreateList = await importRoleMenu(fileList[0]);
      setRoleMenuCreateList(roleMenuCreateList);
      return roleMenuCreateList;
    } finally {
      setIsRoleMenuImportLoading(false);
    }
  };

  const handleRoleMenuImport = async () => {
    setIsRoleMenuImportLoading(true);
    try {
      await batchCreateRoleMenu(roleMenuCreateList);
      message.success("导入成功");
      setIsRoleMenuImportModalVisible(false);
      await onRoleMenuQueryFinish();
    } finally {
      setIsRoleMenuImportLoading(false);
      setRoleMenuCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onRoleMenuExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportRoleMenuPage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isRoleMenuQueryShow}>
        <div className="shadow-sm">
          <RoleMenuQueryComponent
            onRoleMenuQueryFinish={onRoleMenuQueryFinish}
            onRoleMenuQueryReset={handleRoleMenuQueryReset}
            roleMenuQueryForm={ roleMenuQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onRoleMenuCreate}
          onImport={onRoleMenuImport}
          onExport={onRoleMenuExport}
          onBatchModify={onRoleMenuBatchModify}
          onConfirmBatchRemove={handleRoleMenuBatchRemove}
          onConfirmBatchRemoveCancel={handleRoleMenuBatchRemoveCancel}
          isQueryShow={isRoleMenuQueryShow}
          onQueryShow={onRoleMenuQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ roleMenuPageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<RoleMenuPage>
          columns={ filteredRoleMenuColumns}
          dataSource={ roleMenuPageDataSource}
          total={ roleMenuPageTotalCount}
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
          <RoleMenuCreateComponent
            isRoleMenuCreateModalVisible={isRoleMenuCreateModalVisible}
            onRoleMenuCreateCancel={handleRoleMenuCreateCancel}
            onRoleMenuCreateFinish={handleRoleMenuCreateFinish}
            isRoleMenuCreateLoading={isRoleMenuCreateLoading}
            roleMenuCreateForm={ roleMenuCreateForm}
          />
        </div>
        <div>
          <RoleMenuDetailComponent
            isRoleMenuDetailDrawerVisible={isRoleMenuDetailDrawerVisible}
            onRoleMenuDetailClose={onRoleMenuDetailClose}
            roleMenuDetail={ roleMenuDetail}
          />
        </div>
        <div>
          <RoleMenuModifyComponent
            isRoleMenuModifyModalVisible={isRoleMenuModifyModalVisible}
            onRoleMenuModifyCancel={handleRoleMenuModifyCancel}
            onRoleMenuModifyFinish={handleRoleMenuModifyFinish}
            isRoleMenuModifyLoading={isRoleMenuModifyLoading}
            roleMenuModifyForm={ roleMenuModifyForm}
          />
        </div>
        <div>
          <RoleMenuBatchModifyComponent
            isRoleMenuBatchModifyModalVisible={isRoleMenuBatchModifyModalVisible}
            onRoleMenuBatchModifyCancel={handleRoleMenuBatchModifyCancel}
            onRoleMenuBatchModifyFinish={handleRoleMenuBatchModifyFinish}
            isRoleMenuBatchModifyLoading={isRoleMenuBatchModifyLoading}
            roleMenuBatchModifyForm={ roleMenuBatchModifyForm}
          />
        </div>
        <div>
          <RoleMenuImportComponent
            isRoleMenuImportModalVisible={isRoleMenuImportModalVisible}
            isRoleMenuImportLoading={isRoleMenuImportLoading}
            onRoleMenuImportFinish={onRoleMenuImportFinish}
            onRoleMenuImportCancel={handleRoleMenuImportCancel}
            handleRoleMenuImport={handleRoleMenuImport}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleMenu;