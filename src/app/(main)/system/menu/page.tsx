'use client';
import SvgIcon from '@/components/assist/svg-icon';
import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import {
  batchCreateMenus,
  batchDeleteMenu,
  createMenu,
  deleteMenu,
  exportMenu,
  importMenu,
  updateMenu,
  useMenu,
  useMenus,
} from '@/service/menu';
import { createPaginationRequest } from '@/types';
import { CreateMenu, ListMenusRequest, Menu, UpdateMenu } from '@/types/menu';
import { Form, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { format } from 'date-fns';
import { MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import CreateMenuComponent from './components/create-menu';
import ImportMenuComponent from './components/import-menu';
import MenuDetailComponent from './components/menu-detail';
import QueryMenuComponent from './components/query-menu';
import UpdateMenuComponent from './components/update-menu';

const MenuPage: React.FC = () => {
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
  const [isQueryMenuShow, setIsQueryMenuShow] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryMenuForm] = Form.useForm();
  const [menuQueryParams, setMenuQueryParams] = useState<ListMenusRequest>();

  // 用 useMenus 获取菜单列表数据
  const {
    menus: menuListDataSource,
    total,
    isLoading: isMenuListLoading,
    mutateMenus,
  } = useMenus({
    ...menuQueryParams,
    ...createPaginationRequest(current, pageSize),
  });

  const onQueryMenuShow = () => {
    setIsQueryMenuShow((prevState) => !prevState);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  const handleQueryMenuReset = () => {
    resetPagination();
    queryMenuForm.resetFields();
    mutateMenus();
  };

  const onQueryMenuFinish = async () => {
    const values = queryMenuForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const queryMenu = values as ListMenusRequest;
    const filteredQueryMenu = Object.fromEntries(
      Object.entries(queryMenu).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    setMenuQueryParams(filteredQueryMenu as ListMenusRequest);
  };

  // 详情模块
  const [isMenuDetailDrawerVisible, setIsMenuDetailDrawerVisible] =
    useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const { menu: menuDetail, isLoading: isMenuDetailLoading } = useMenu(
    selectedMenuId || '',
  );

  const onMenuDetail = (menu: Menu) => {
    setSelectedMenuId(menu.id);
    setIsMenuDetailDrawerVisible(true);
  };

  const onMenuDetailClose = () => {
    setSelectedMenuId(null);
    setIsMenuDetailDrawerVisible(false);
  };

  // 表格列信息
  const menuColumns: ColumnsType<Menu> = [
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
      render: (_: number, _record: Menu, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text) =>
        text ? <SvgIcon name={text} strokeWidth={1.3} /> : '-',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '15%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text) => (text ? text : '-'),
      width: '8%',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '15%',
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
            onClick={() => onUpdateMenu(record)}
          >
            <PenLine size={12} />
            编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定删除吗? 删除后将无法找回"
            onConfirm={() => handleDeleteMenu(record)}
            okText="确认"
            cancelText="取消"
          >
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-remove"
            >
              <Trash2 size={12} />
              删除
            </button>
          </Popconfirm>

          {showMore && (
            <button
              type="button"
              className="flex items-center gap-0.5 text-xs btn-operation"
            >
              <span>更多</span>
              <MoreHorizontal size={12} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    menuColumns.map((col) => col.key),
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
  const filteredMenuColumns = menuColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 新增模块
  const [isCreateMenuModalVisible, setIsCreateMenuModalVisible] =
    useState(false);
  const [isCreateMenuLoading, setIsCreateMenuLoading] = useState(false);
  const [createMenuForm] = Form.useForm();

  const onCreateMenu = () => {
    setIsCreateMenuModalVisible(true);
  };
  const handleCreateMenuCancel = () => {
    createMenuForm.resetFields();
    setIsCreateMenuModalVisible(false);
  };
  const handleCreateMenuFinish = async (data: CreateMenu) => {
    setIsCreateMenuLoading(true);
    try {
      await createMenu({ menu: data });
      message.success('新增成功');
      createMenuForm.resetFields();
      setIsCreateMenuModalVisible(false);
      mutateMenus();
    } finally {
      setIsCreateMenuLoading(false);
    }
  };

  // 单个删除模块
  const handleDeleteMenu = async (menu: Menu) => {
    await deleteMenu(menu.id);
    message.success('删除成功');
    mutateMenus();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Menu[]>([]);

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Menu[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleMenuBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchDeleteMenu({ ids: selectedRows.map((row) => row.id) });
      message.success('删除成功');
      mutateMenus();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };

  const handleMenuBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isUpdateMenuModalVisible, setIsUpdateMenuModalVisible] =
    useState<boolean>(false);
  const [isUpdateMenuLoading, setIsUpdateMenuLoading] =
    useState<boolean>(false);
  const [updateMenuForm] = Form.useForm();

  const onUpdateMenu = (menu: Menu) => {
    setIsUpdateMenuModalVisible(true);
    setSelectedRowKeys([menu.id]);
    setSelectedRows([menu]);
    updateMenuForm.setFieldsValue({ ...menu });
  };

  const handleUpdateMenuCancel = () => {
    resetSelectedRows();
    updateMenuForm.resetFields();
    setIsUpdateMenuModalVisible(false);
  };

  const handleUpdateMenuFinish = async () => {
    const updateMenuData =
      (await updateMenuForm.validateFields()) as UpdateMenu;
    const req = { ...updateMenuData, id: selectedRows[0].id };
    setIsUpdateMenuLoading(true);
    try {
      await updateMenu({ menu: req });
      updateMenuForm.resetFields();
      message.success('更新成功');
      mutateMenus();
      resetSelectedRows();
    } finally {
      setIsUpdateMenuLoading(false);
      setIsUpdateMenuModalVisible(false);
    }
  };

  // 导入模块
  const [isImportMenuModalVisible, setIsImportMenuModalVisible] =
    useState<boolean>(false);
  const [isImportMenuLoading, setIsImportMenuLoading] =
    useState<boolean>(false);
  const [createMenuList, setCreateMenuList] = useState<CreateMenu[]>([]);

  const onImportMenu = () => {
    setIsImportMenuModalVisible(true);
  };

  const handleImportMenuCancel = () => {
    setIsImportMenuModalVisible(false);
  };

  const onImportMenuFinish = async (fileList: RcFile[]) => {
    try {
      setIsImportMenuLoading(true);
      const createMenuList = await importMenu({ file: fileList[0] });
      setCreateMenuList(createMenuList.menus);
      return createMenuList;
    } finally {
      setIsImportMenuLoading(false);
    }
  };

  const handleImportMenu = async () => {
    setIsImportMenuLoading(true);
    try {
      await batchCreateMenus({ menus: createMenuList });
      message.success('导入成功');
      setIsImportMenuModalVisible(false);
      mutateMenus();
    } finally {
      setIsImportMenuLoading(false);
      setCreateMenuList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onMenuExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportMenu({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isQueryMenuShow}>
        <QueryMenuComponent
          onQueryMenuFinish={onQueryMenuFinish}
          onQueryMenuReset={handleQueryMenuReset}
          onQueryMenuForm={queryMenuForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateMenu}
          onImport={onImportMenu}
          onExport={onMenuExport}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleMenuBatchRemove}
          onConfirmBatchRemoveCancel={handleMenuBatchRemoveCancel}
          isQueryShow={isQueryMenuShow}
          onQueryShow={onQueryMenuShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={menuColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<Menu>
          columns={filteredMenuColumns}
          dataSource={menuListDataSource || []}
          total={total || 0}
          current={current}
          page_size={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
          loading={isMenuListLoading}
        />
      </div>
      <div>
        <div>
          <CreateMenuComponent
            isCreateMenuModalVisible={isCreateMenuModalVisible}
            onCreateMenuCancel={handleCreateMenuCancel}
            onCreateMenuFinish={handleCreateMenuFinish}
            isCreateMenuLoading={isCreateMenuLoading}
            createMenuForm={createMenuForm}
            optionDataSource={menuListDataSource || []}
          />
        </div>
        <div>
          <MenuDetailComponent
            isMenuDetailDrawerVisible={isMenuDetailDrawerVisible}
            onMenuDetailClose={onMenuDetailClose}
            menuDetail={menuDetail}
            loading={isMenuDetailLoading}
          />
        </div>
        <div>
          <UpdateMenuComponent
            isUpdateMenuModalVisible={isUpdateMenuModalVisible}
            onUpdateMenuCancel={handleUpdateMenuCancel}
            onUpdateMenuFinish={handleUpdateMenuFinish}
            isUpdateMenuLoading={isUpdateMenuLoading}
            updateMenuForm={updateMenuForm}
            optionDataSource={menuListDataSource || []}
          />
        </div>
        <div>
          <ImportMenuComponent
            isImportMenuModalVisible={isImportMenuModalVisible}
            isImportMenuLoading={isImportMenuLoading}
            onImportMenuFinish={onImportMenuFinish}
            onImportMenuCancel={handleImportMenuCancel}
            handleImportMenu={handleImportMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
