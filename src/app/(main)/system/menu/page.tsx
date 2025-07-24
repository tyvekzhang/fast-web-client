'use client';
import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import SvgIcon from '@/components/svg-icon';
import {
  batchCreateMenus,
  batchDeleteMenu,
  batchUpdateMenus,
  createMenu,
  deleteMenu,
  exportMenuPage,
  getMenu,
  importMenu,
  listMenus,
  updateMenu,
} from '@/service/menu';
import { BaseQueryImpl } from '@/types';
import {
  BatchUpdateMenu,
  CreateMenu,
  ListMenusRequest,
  Menu,
  MenuDetail,
  UpdateMenu,
} from '@/types/menu';
import { Form, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Eye, MoreHorizontal, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import BatchUpdateMenuComponent from './components/batch-update-menu';
import CreateMenuComponent from './components/create-menu';
import ImportMenuComponent from './components/import-menu';
import MenuDetailComponent from './components/menu-detail';
import MenuQueryComponent from './components/query-menu';
import UpdateMenuComponent from './components/update-menu';

const MenuPage: React.FC = () => {
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
  const [isMenuQueryShow, setIsMenuQueryShow] = useState<boolean>(true);
  const [menuPageDataSource, setMenuPageDataSource] = useState<Menu[]>([]);
  const [menuPageTotalCount, setMenuPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const onMenuQueryShow = () => {
    setIsMenuQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const menuQuery =
        (await menuQueryForm.validateFields()) as ListMenusRequest;
      const pageData = BaseQueryImpl.create(current, page_size);
      const resp = await listMenus({ ...pageData, ...menuQuery });
      setMenuPageDataSource(resp.records);
      setMenuPageTotalCount(resp.total);
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
  const [isMenuDetailDrawerVisible, setIsMenuDetailDrawerVisible] =
    useState<boolean>(false);
  const [menuDetail, setMenuDetail] = useState<MenuDetail | null>(null);
  const onMenuDetail = async (menuPage: Menu) => {
    setIsMenuDetailDrawerVisible(true);
    const id = menuPage.id;
    await getMenu(id).then(setMenuDetail);
  };

  const onMenuDetailClose = async () => {
    setMenuDetail(null);
    setIsMenuDetailDrawerVisible(false);
  };

  // 表格列信息
  const menuPageColumns: ColumnsType<Menu> = [
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
      width: '8%',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text) =>
        text ? <SvgIcon name={text} strokeWidth={1.3} /> : '-',
      ellipsis: true,
      width: '6%',
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text) => (text ? text : '-'),
      width: '6%',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      render: (text) => (text ? text : '-'),
      ellipsis: true,
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text ? text : '-'),
      width: '4%',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
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
            onClick={() => onMenuDetail(record)}
          >
            <Eye size={12} />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onUpdateMenu(record)}
          >
            <PenLine size={12} />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={() => handleMenuDelete(record)}
          >
            <Trash2 size={12} />
            删除
          </button>

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
    menuPageColumns.map((col) => col.key),
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
  const filteredMenuColumns = menuPageColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [menuQueryForm] = Form.useForm();
  const handleMenuQueryReset = () => {
    resetPagination();
    menuQueryForm.resetFields();
    onMenuQueryFinish();
  };
  const onMenuQueryFinish = async () => {
    debugger;
    const values = menuQueryForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const menuQuery = values as ListMenusRequest;
    console.log(menuQuery);
    const filteredMenuQuery = Object.fromEntries(
      Object.entries(menuQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleMenuQueryFinish(filteredMenuQuery as ListMenusRequest);
  };
  const handleMenuQueryFinish = async (menuPage: ListMenusRequest) => {
    await listMenus({
      ...BaseQueryImpl.create(current, page_size),
      ...menuPage,
    }).then((resp) => {
      setMenuPageDataSource(resp.records);
      setMenuPageTotalCount(resp.total);
    });
  };

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
      await onMenuQueryFinish();
    } finally {
      setIsCreateMenuLoading(false);
      setIsCreateMenuModalVisible(false);
    }
  };

  // 单个删除模块
  const handleMenuDelete = async (menuPage: Menu) => {
    await deleteMenu(menuPage.id);
    await onMenuQueryFinish();
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
      await onMenuQueryFinish();
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
  const onUpdateMenu = (menuPage: Menu) => {
    setIsUpdateMenuModalVisible(true);
    setSelectedRowKeys([menuPage.id]);
    setSelectedRows([menuPage]);
    updateMenuForm.setFieldsValue({ ...menuPage });
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
      await onMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsUpdateMenuLoading(false);
      setIsUpdateMenuModalVisible(false);
    }
  };

  // 批量更新模块
  const onMenuBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsUpdateMenuModalVisible(true);
      updateMenuForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsMenuBatchModifyModalVisible(true);
      menuBatchModifyForm.resetFields();
    }
  };
  const [isMenuBatchModifyModalVisible, setIsMenuBatchModifyModalVisible] =
    useState<boolean>(false);
  const [isMenuBatchModifyLoading, setIsMenuBatchModifyLoading] =
    useState<boolean>(false);
  const [menuBatchModifyForm] = Form.useForm();
  const handleMenuBatchModifyCancel = async () => {
    menuBatchModifyForm.resetFields();
    setIsMenuBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };
  const handleMenuBatchModifyFinish = async () => {
    const menuBatchModify =
      (await menuBatchModifyForm.validateFields()) as BatchUpdateMenu;
    setIsMenuBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      const ids = selectedRows.map((row) => row.id);
      await batchUpdateMenus({ ids: ids, menu: menuBatchModify });
      menuBatchModifyForm.resetFields();
      message.success('更新成功');
      await onMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsMenuBatchModifyLoading(false);
      setIsMenuBatchModifyModalVisible(false);
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
      await onMenuQueryFinish();
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
      await exportMenuPage({ ids: selectedRows.map((row) => row.id) });
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isMenuQueryShow}>
        <MenuQueryComponent
          onMenuQueryFinish={onMenuQueryFinish}
          onMenuQueryReset={handleMenuQueryReset}
          menuQueryForm={menuQueryForm}
        />
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onCreateMenu}
          onImport={onImportMenu}
          onExport={onMenuExport}
          onBatchModify={onMenuBatchModify}
          onConfirmBatchRemove={handleMenuBatchRemove}
          onConfirmBatchRemoveCancel={handleMenuBatchRemoveCancel}
          isQueryShow={isMenuQueryShow}
          onQueryShow={onMenuQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={menuPageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<Menu>
          columns={filteredMenuColumns}
          dataSource={menuPageDataSource}
          total={menuPageTotalCount}
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
          <CreateMenuComponent
            isCreateMenuModalVisible={isCreateMenuModalVisible}
            onCreateMenuCancel={handleCreateMenuCancel}
            onCreateMenuFinish={handleCreateMenuFinish}
            isCreateMenuLoading={isCreateMenuLoading}
            createMenuForm={createMenuForm}
            optionDataSource={menuPageDataSource}
          />
        </div>
        <div>
          <MenuDetailComponent
            isMenuDetailDrawerVisible={isMenuDetailDrawerVisible}
            onMenuDetailClose={onMenuDetailClose}
            menuDetail={menuDetail}
          />
        </div>
        <div>
          <UpdateMenuComponent
            isUpdateMenuModalVisible={isUpdateMenuModalVisible}
            onUpdateMenuCancel={handleUpdateMenuCancel}
            onUpdateMenuFinish={handleUpdateMenuFinish}
            isUpdateMenuLoading={isUpdateMenuLoading}
            updateMenuForm={updateMenuForm}
            optionDataSource={menuPageDataSource}
          />
        </div>
        <div>
          <BatchUpdateMenuComponent
            isBatchUpdateMenuModalVisible={isMenuBatchModifyModalVisible}
            onBatchUpdateMenuCancel={handleMenuBatchModifyCancel}
            onBatchUpdateMenuFinish={handleMenuBatchModifyFinish}
            isBatchUpdateMenuLoading={isMenuBatchModifyLoading}
            batchUpdateMenuForm={menuBatchModifyForm}
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
