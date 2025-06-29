import ActionButtonComponent from "@/components/base/action-button";
import { PaginatedTable } from "@/components/base/paginated-table";
import { message } from "@/components/GlobalToast";
import dayjs from 'dayjs';
import {
  batchCreateDictType,
  batchModifyDictType,
  batchRemoveDictType,
  createDictType,
  exportDictTypePage,
  fetchDictTypeByPage,
  fetchDictTypeDetail,
  importDictType,
  modifyDictType,
  removeDictType,
} from "@/service/dict-type";
import { BaseQueryImpl } from "@/types";
import { DictTypeBatchModify, DictTypeCreate, DictTypeDetail, DictTypeModify, DictTypePage, DictTypeQuery } from "@/types/dict-type";
import DictTypeBatchModifyComponent from "@/views/system/dict-type/components/dict-type-batch-modify";
import DictTypeCreateComponent from "@/views/system/dict-type/components/dict-type-create";
import DictTypeImportComponent from "@/views/system/dict-type/components/dict-type-import";
import DictTypeModifyComponent from "@/views/system/dict-type/components/dict-type-modify";
import DictTypeQueryComponent from "@/views/system/dict-type/components/dict-type-query";
import { Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import type { RcFile } from "rc-upload/lib/interface";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import DictTypeDetailComponent from "@/views/system/dict-type/components/dict-type-detail";
import TransitionWrapper from '@/components/base/transition-wrapper';

const DictType: React.FC = () => {
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
  const [isDictTypeQueryShow, setIsDictTypeQueryShow] = useState<boolean>(true)
  const [dictTypePageDataSource, setDictTypePageDataSource] = useState<DictTypePage[]>([]);
  const [dictTypePageTotalCount, setDictTypePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onDictTypeQueryShow = () => {
    setIsDictTypeQueryShow(prevState => !prevState)
  }
  useEffect(() => {
    const fetchData = async () => {
      const dictTypeQuery = (await dictTypeQueryForm.validateFields()) as DictTypeQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchDictTypeByPage(pageData, dictTypeQuery);
      setDictTypePageDataSource(resp.records);
      setDictTypePageTotalCount(resp.total);
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
  const [isDictTypeDetailDrawerVisible, setIsDictTypeDetailDrawerVisible] = useState<boolean>(false);
  const [dictTypeDetail, setDictTypeDetail] = useState<DictTypeDetail | null>(null);
  const onDictTypeDetail = async (dictTypePage: DictTypePage) => {
    setIsDictTypeDetailDrawerVisible(true);
    const id = dictTypePage.id;
    await fetchDictTypeDetail(id).then(setDictTypeDetail);
  };

  const onDictTypeDetailClose = async () => {
    setDictTypeDetail(null);
    setIsDictTypeDetailDrawerVisible(false);
  };

  // 表格列信息
  const dictTypePageColumns: ColumnsType<DictTypePage> = [
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
      render: (_: number, _record: DictTypePage, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "字典名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "字典类型",
      dataIndex: "type",
      key: "type",
      render: (text: string ) => {
        if (text) {
          return <a className={"text-blue-600"} href={`/system/dict-data?type=${text}`}>{text}</a>;
        }
        return "-";
      },
      width: "12%",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "6%",
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text: string) => (
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>: "-"
      ),
      width: "14%",
      ellipsis: true,
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
            onClick={ () => onDictTypeDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onDictTypeModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleDictTypeDelete(record)}
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

  const [visibleColumns, setVisibleColumns] = useState(dictTypePageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredDictTypeColumns = dictTypePageColumns.filter(col => visibleColumns.includes(col.key));

  const [dictTypeQueryForm] = Form.useForm();
  const handleDictTypeQueryReset = () => {
    resetPagination();
    dictTypeQueryForm.resetFields();
  };
  const onDictTypeQueryFinish = async () => {
    const dictTypeQueryFormData = dictTypeQueryForm.getFieldsValue();
    const { create_time } = dictTypeQueryFormData
    if (create_time) {
      const [startDate, endDate] = create_time
      dictTypeQueryFormData.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    const dictTypeQuery = dictTypeQueryFormData as DictTypeQuery;
    const filteredDictTypeQuery = Object.fromEntries(
      Object.entries(dictTypeQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleDictTypeQueryFinish(filteredDictTypeQuery as DictTypeQuery);
  };
  const handleDictTypeQueryFinish = async (dictTypeQuery: DictTypeQuery) => {
    await fetchDictTypeByPage(BaseQueryImpl.create(current, pageSize), dictTypeQuery).then((resp) => {
      setDictTypePageDataSource(resp.records);
      setDictTypePageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isDictTypeCreateModalVisible, setIsDictTypeCreateModalVisible] = useState(false);
  const [isDictTypeCreateLoading, setIsDictTypeCreateLoading] = useState(false);
  const [dictTypeCreateForm] = Form.useForm();
  const onDictTypeCreate = () => {
    setIsDictTypeCreateModalVisible(true);
  };
  const handleDictTypeCreateCancel = () => {
    dictTypeCreateForm.resetFields();
    setIsDictTypeCreateModalVisible(false);
  };
  const handleDictTypeCreateFinish = async (dictTypeCreate: DictTypeCreate) => {
    setIsDictTypeCreateLoading(true);
    try {
      await createDictType(dictTypeCreate);
      message.success("新增成功");
      dictTypeCreateForm.resetFields();
      await onDictTypeQueryFinish();
    } finally {
      setIsDictTypeCreateLoading(false);
      setIsDictTypeCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleDictTypeDelete = async (dictTypePage: DictTypePage) => {
    await removeDictType(dictTypePage.id);
    await onDictTypeQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DictTypePage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: DictTypePage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleDictTypeBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveDictType(selectedRows.map((row) => row.id));
      await onDictTypeQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleDictTypeBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isDictTypeModifyModalVisible, setIsDictTypeModifyModalVisible] = useState<boolean>(false);
  const [isDictTypeModifyLoading, setIsDictTypeModifyLoading] = useState<boolean>(false);
  const [dictTypeModifyForm] = Form.useForm();
  const onDictTypeModify = (dictTypePage: DictTypePage) => {
    setIsDictTypeModifyModalVisible(true);
    setSelectedRowKeys([dictTypePage.id])
    setSelectedRows([dictTypePage])
    dictTypeModifyForm.setFieldsValue({ ...dictTypePage });
  };

  const handleDictTypeModifyCancel = () => {
    resetSelectedRows();
    dictTypeModifyForm.resetFields();
    setIsDictTypeModifyModalVisible(false);
  };
  const handleDictTypeModifyFinish = async () => {
    const dictTypeModifyData = (await dictTypeModifyForm.validateFields()) as DictTypeModify;
    const dictTypeModify = {...dictTypeModifyData, id: selectedRows[0].id};
    setIsDictTypeModifyLoading(true);
    try {
      await modifyDictType(dictTypeModify);
      dictTypeModifyForm.resetFields();
      message.success("更新成功");
      await onDictTypeQueryFinish();
      resetSelectedRows();
    } finally {
      setIsDictTypeModifyLoading(false);
      setIsDictTypeModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onDictTypeBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsDictTypeModifyModalVisible(true);
      dictTypeModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsDictTypeBatchModifyModalVisible(true);
      dictTypeBatchModifyForm.resetFields();
    }
  };
  const [isDictTypeBatchModifyModalVisible, setIsDictTypeBatchModifyModalVisible] = useState<boolean>(false);
  const [isDictTypeBatchModifyLoading, setIsDictTypeBatchModifyLoading] = useState<boolean>(false);
  const [dictTypeBatchModifyForm] = Form.useForm();
  const handleDictTypeBatchModifyCancel = async () => {
    dictTypeBatchModifyForm.resetFields();
    setIsDictTypeBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleDictTypeBatchModifyFinish = async () => {
    const dictTypeBatchModify = (await dictTypeBatchModifyForm.validateFields()) as DictTypeBatchModify;
    setIsDictTypeBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      dictTypeBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyDictType(dictTypeBatchModify);
      dictTypeBatchModifyForm.resetFields();
      message.success("更新成功");
      await onDictTypeQueryFinish();
      resetSelectedRows();
    } finally {
      setIsDictTypeBatchModifyLoading(false);
      setIsDictTypeBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isDictTypeImportModalVisible, setIsDictTypeImportModalVisible] = useState<boolean>(false);
  const [isDictTypeImportLoading, setIsDictTypeImportLoading] = useState<boolean>(false);
  const [dictTypeCreateList, setDictTypeCreateList] = useState<DictTypeCreate[]>([]);

  const onDictTypeImport = () => {
    setIsDictTypeImportModalVisible(true);
  };
  const handleDictTypeImportCancel = () => {
    setIsDictTypeImportModalVisible(false);
  };
  const onDictTypeImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsDictTypeImportLoading(true);
      const dictTypeCreateList = await importDictType(fileList[0]);
      setDictTypeCreateList(dictTypeCreateList);
      return dictTypeCreateList;
    } finally {
      setIsDictTypeImportLoading(false);
    }
  };

  const handleDictTypeImport = async () => {
    setIsDictTypeImportLoading(true);
    try {
      await batchCreateDictType(dictTypeCreateList);
      message.success("导入成功");
      setIsDictTypeImportModalVisible(false);
      await onDictTypeQueryFinish();
    } finally {
      setIsDictTypeImportLoading(false);
      setDictTypeCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onDictTypeExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportDictTypePage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isDictTypeQueryShow}>
        <div className="shadow-sm">
          <DictTypeQueryComponent
            onDictTypeQueryFinish={onDictTypeQueryFinish}
            onDictTypeQueryReset={handleDictTypeQueryReset}
            dictTypeQueryForm={ dictTypeQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onDictTypeCreate}
          onImport={onDictTypeImport}
          onExport={onDictTypeExport}
          onBatchModify={onDictTypeBatchModify}
          onConfirmBatchRemove={handleDictTypeBatchRemove}
          onConfirmBatchRemoveCancel={handleDictTypeBatchRemoveCancel}
          isQueryShow={isDictTypeQueryShow}
          onQueryShow={onDictTypeQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ dictTypePageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<DictTypePage>
          columns={ filteredDictTypeColumns}
          dataSource={ dictTypePageDataSource}
          total={ dictTypePageTotalCount}
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
          <DictTypeCreateComponent
            isDictTypeCreateModalVisible={isDictTypeCreateModalVisible}
            onDictTypeCreateCancel={handleDictTypeCreateCancel}
            onDictTypeCreateFinish={handleDictTypeCreateFinish}
            isDictTypeCreateLoading={isDictTypeCreateLoading}
            dictTypeCreateForm={ dictTypeCreateForm}
          />
        </div>
        <div>
          <DictTypeDetailComponent
            isDictTypeDetailDrawerVisible={isDictTypeDetailDrawerVisible}
            onDictTypeDetailClose={onDictTypeDetailClose}
            dictTypeDetail={ dictTypeDetail}
          />
        </div>
        <div>
          <DictTypeModifyComponent
            isDictTypeModifyModalVisible={isDictTypeModifyModalVisible}
            onDictTypeModifyCancel={handleDictTypeModifyCancel}
            onDictTypeModifyFinish={handleDictTypeModifyFinish}
            isDictTypeModifyLoading={isDictTypeModifyLoading}
            dictTypeModifyForm={ dictTypeModifyForm}
          />
        </div>
        <div>
          <DictTypeBatchModifyComponent
            isDictTypeBatchModifyModalVisible={isDictTypeBatchModifyModalVisible}
            onDictTypeBatchModifyCancel={handleDictTypeBatchModifyCancel}
            onDictTypeBatchModifyFinish={handleDictTypeBatchModifyFinish}
            isDictTypeBatchModifyLoading={isDictTypeBatchModifyLoading}
            dictTypeBatchModifyForm={ dictTypeBatchModifyForm}
          />
        </div>
        <div>
          <DictTypeImportComponent
            isDictTypeImportModalVisible={isDictTypeImportModalVisible}
            isDictTypeImportLoading={isDictTypeImportLoading}
            onDictTypeImportFinish={onDictTypeImportFinish}
            onDictTypeImportCancel={handleDictTypeImportCancel}
            handleDictTypeImport={handleDictTypeImport}
          />
        </div>
      </div>
    </div>
  );
};

export default DictType;
