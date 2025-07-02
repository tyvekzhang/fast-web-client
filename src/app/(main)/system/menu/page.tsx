'use client';
import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import { message } from '@/components/GlobalToast';
import SvgIcon from '@/components/SvgIcon';
import {
  batchCreateMenu,
  batchModifyMenu,
  batchRemoveMenu,
  createMenu,
  exportMenuPage,
  fetchMenuByPage,
  fetchMenuDetail,
  importMenu,
  modifyMenu,
  removeMenu,
} from '@/service/menu';
import { BaseQueryImpl } from '@/types';
import {
  MenuBatchModify,
  MenuCreate,
  MenuDetail,
  MenuModify,
  MenuPage,
  MenuQuery,
} from '@/types/menu';
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
import MenuBatchModifyComponent from './components/menu-batch-modify';
import MenuCreateComponent from './components/menu-create';
import MenuDetailComponent from './components/menu-detail';
import MenuImportComponent from './components/menu-import';
import MenuModifyComponent from './components/menu-modify';
import MenuQueryComponent from './components/menu-query';

const Menu: React.FC = () => {
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
  const [menuPageDataSource, setMenuPageDataSource] = useState<MenuPage[]>([]);
  const [menuPageTotalCount, setMenuPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onMenuQueryShow = () => {
    setIsMenuQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const menuQuery = (await menuQueryForm.validateFields()) as MenuQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchMenuByPage(pageData, menuQuery);
      setMenuPageDataSource(resp.records);
      setMenuPageTotalCount(resp.total);
    };
    fetchData().then(() => {});
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
  const [isMenuDetailDrawerVisible, setIsMenuDetailDrawerVisible] =
    useState<boolean>(false);
  const [menuDetail, setMenuDetail] = useState<MenuDetail | null>(null);
  const onMenuDetail = async (menuPage: MenuPage) => {
    setIsMenuDetailDrawerVisible(true);
    const id = menuPage.id;
    await fetchMenuDetail(id).then(setMenuDetail);
  };

  const onMenuDetailClose = async () => {
    setMenuDetail(null);
    setIsMenuDetailDrawerVisible(false);
  };

  // 表格列信息
  const menuPageColumns: ColumnsType<MenuPage> = [
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
      render: (_: number, _record: MenuPage, rowIndex: number) => rowIndex + 1,
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
        text ? (
          <SvgIcon style={{ color: '#595959' }} name={text} size={14} />
        ) : (
          '-'
        ),
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
      width: '4%',
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
            onClick={() => onMenuDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={() => onMenuModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={() => handleMenuDelete(record)}
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
    menuPageColumns.map((col) => col.key),
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
  const filteredMenuColumns = menuPageColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [menuQueryForm] = Form.useForm();
  const handleMenuQueryReset = () => {
    resetPagination();
    menuQueryForm.resetFields();
  };
  const onMenuQueryFinish = async () => {
    const values = menuQueryForm.getFieldsValue();
    const { create_time } = values;
    if (create_time) {
      const [startDate, endDate] = create_time;
      values.create_time = [
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      ];
    }
    const menuQuery = values as MenuQuery;
    console.log(menuQuery);
    const filteredMenuQuery = Object.fromEntries(
      Object.entries(menuQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleMenuQueryFinish(filteredMenuQuery as MenuQuery);
  };
  const handleMenuQueryFinish = async (menuPage: MenuQuery) => {
    await fetchMenuByPage(
      BaseQueryImpl.create(current, pageSize),
      menuPage,
    ).then((resp) => {
      setMenuPageDataSource(resp.records);
      setMenuPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isMenuCreateModalVisible, setIsMenuCreateModalVisible] =
    useState(false);
  const [isMenuCreateLoading, setIsMenuCreateLoading] = useState(false);
  const [menuCreateForm] = Form.useForm();
  const onMenuCreate = () => {
    setIsMenuCreateModalVisible(true);
  };
  const handleMenuCreateCancel = () => {
    menuCreateForm.resetFields();
    setIsMenuCreateModalVisible(false);
  };
  const handleMenuCreateFinish = async (menuCreate: MenuCreate) => {
    setIsMenuCreateLoading(true);
    try {
      await createMenu(menuCreate);
      message.success('新增成功');
      menuCreateForm.resetFields();
      await onMenuQueryFinish();
    } finally {
      setIsMenuCreateLoading(false);
      setIsMenuCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleMenuDelete = async (menuPage: MenuPage) => {
    await removeMenu(menuPage.id);
    await onMenuQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<MenuPage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: MenuPage[],
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
      await batchRemoveMenu(selectedRows.map((row) => row.id));
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
  const [isMenuModifyModalVisible, setIsMenuModifyModalVisible] =
    useState<boolean>(false);
  const [isMenuModifyLoading, setIsMenuModifyLoading] =
    useState<boolean>(false);
  const [menuModifyForm] = Form.useForm();
  const onMenuModify = (menuPage: MenuPage) => {
    setIsMenuModifyModalVisible(true);
    setSelectedRowKeys([menuPage.id]);
    setSelectedRows([menuPage]);
    menuModifyForm.setFieldsValue({ ...menuPage });
  };

  const handleMenuModifyCancel = () => {
    resetSelectedRows();
    menuModifyForm.resetFields();
    setIsMenuModifyModalVisible(false);
  };
  const handleMenuModifyFinish = async () => {
    const menuModifyData =
      (await menuModifyForm.validateFields()) as MenuModify;
    const menuModify = { ...menuModifyData, id: selectedRows[0].id };
    setIsMenuModifyLoading(true);
    try {
      await modifyMenu(menuModify);
      menuModifyForm.resetFields();
      message.success('更新成功');
      await onMenuQueryFinish();
      resetSelectedRows();
    } finally {
      setIsMenuModifyLoading(false);
      setIsMenuModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onMenuBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsMenuModifyModalVisible(true);
      menuModifyForm.setFieldsValue({ ...selectedRows[0] });
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
      (await menuBatchModifyForm.validateFields()) as MenuBatchModify;
    setIsMenuBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }
    try {
      menuBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyMenu(menuBatchModify);
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
  const [isMenuImportModalVisible, setIsMenuImportModalVisible] =
    useState<boolean>(false);
  const [isMenuImportLoading, setIsMenuImportLoading] =
    useState<boolean>(false);
  const [menuCreateList, setMenuCreateList] = useState<MenuCreate[]>([]);

  const onMenuImport = () => {
    setIsMenuImportModalVisible(true);
  };
  const handleMenuImportCancel = () => {
    setIsMenuImportModalVisible(false);
  };
  const onMenuImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsMenuImportLoading(true);
      const menuCreateList = await importMenu(fileList[0]);
      setMenuCreateList(menuCreateList);
      return menuCreateList;
    } finally {
      setIsMenuImportLoading(false);
    }
  };

  const handleMenuImport = async () => {
    setIsMenuImportLoading(true);
    try {
      await batchCreateMenu(menuCreateList);
      message.success('导入成功');
      setIsMenuImportModalVisible(false);
      await onMenuQueryFinish();
    } finally {
      setIsMenuImportLoading(false);
      setMenuCreateList([]);
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
      await exportMenuPage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isMenuQueryShow}>
        <div className="shadow-sm">
          <MenuQueryComponent
            onMenuQueryFinish={onMenuQueryFinish}
            onMenuQueryReset={handleMenuQueryReset}
            menuQueryForm={menuQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onMenuCreate}
          onImport={onMenuImport}
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
        <PaginatedTable<MenuPage>
          columns={filteredMenuColumns}
          dataSource={menuPageDataSource}
          total={menuPageTotalCount}
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
          <MenuCreateComponent
            isMenuCreateModalVisible={isMenuCreateModalVisible}
            onMenuCreateCancel={handleMenuCreateCancel}
            onMenuCreateFinish={handleMenuCreateFinish}
            isMenuCreateLoading={isMenuCreateLoading}
            menuCreateForm={menuCreateForm}
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
          <MenuModifyComponent
            isMenuModifyModalVisible={isMenuModifyModalVisible}
            onMenuModifyCancel={handleMenuModifyCancel}
            onMenuModifyFinish={handleMenuModifyFinish}
            isMenuModifyLoading={isMenuModifyLoading}
            menuModifyForm={menuModifyForm}
          />
        </div>
        <div>
          <MenuBatchModifyComponent
            isMenuBatchModifyModalVisible={isMenuBatchModifyModalVisible}
            onMenuBatchModifyCancel={handleMenuBatchModifyCancel}
            onMenuBatchModifyFinish={handleMenuBatchModifyFinish}
            isMenuBatchModifyLoading={isMenuBatchModifyLoading}
            menuBatchModifyForm={menuBatchModifyForm}
          />
        </div>
        <div>
          <MenuImportComponent
            isMenuImportModalVisible={isMenuImportModalVisible}
            isMenuImportLoading={isMenuImportLoading}
            onMenuImportFinish={onMenuImportFinish}
            onMenuImportCancel={handleMenuImportCancel}
            handleMenuImport={handleMenuImport}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
