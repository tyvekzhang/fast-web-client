import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import { message } from '@/components/GlobalToast';
import {
  batchCreateDictData,
  batchModifyDictData,
  batchRemoveDictData,
  createDictData,
  exportDictDataPage,
  fetchDictDataByPage,
  fetchDictDataDetail,
  importDictData,
  modifyDictData,
  removeDictData,
} from '@/service/dict-data';
import { BaseQueryImpl } from '@/types';
import {
  DictDataBatchModify,
  DictDataCreate,
  DictDataDetail,
  DictDataModify,
  DictDataPage,
  DictDataQuery,
} from '@/types/dict-data';
import DictDataBatchModifyComponent from '@/views/system/dict-data/components/dict-data-batch-modify';
import DictDataCreateComponent from '@/views/system/dict-data/components/dict-data-create';
import DictDataImportComponent from '@/views/system/dict-data/components/dict-data-import';
import DictDataModifyComponent from '@/views/system/dict-data/components/dict-data-modify';
import DictDataQueryComponent from '@/views/system/dict-data/components/dict-data-query';
import { Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import DictDataDetailComponent from '@/views/system/dict-data/components/dict-data-detail';
import TransitionWrapper from '@/components/base/transition-wrapper';
import { useNavigate } from 'react-router-dom';

const DictData: React.FC = () => {
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
  const [isDictDataQueryShow, setIsDictDataQueryShow] = useState<boolean>(true)
  const [dictDataPageDataSource, setDictDataPageDataSource] = useState<DictDataPage[]>([]);
  const [dictDataPageTotalCount, setDictDataPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onDictDataQueryShow = () => {
    setIsDictDataQueryShow(prevState => !prevState)
  }
  const queryParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    const fetchData = async () => {
      const dictDataQuery = (await dictDataQueryForm.validateFields()) as DictDataQuery;
      if ((dictDataQuery.type === undefined || dictDataQuery.type === "") && dictType) {
        dictDataQuery.type = dictType;
      }
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchDictDataByPage(pageData, dictDataQuery);
      setDictDataPageDataSource(resp.records);
      setDictDataPageTotalCount(resp.total);
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
  const [isDictDataDetailDrawerVisible, setIsDictDataDetailDrawerVisible] = useState<boolean>(false);
  const [dictDataDetail, setDictDataDetail] = useState<DictDataDetail | null>(null);
  const onDictDataDetail = async (dictDataPage: DictDataPage) => {
    setIsDictDataDetailDrawerVisible(true);
    const id = dictDataPage.id;
    await fetchDictDataDetail(id).then(setDictDataDetail);
  };

  const onDictDataDetailClose = async () => {
    setDictDataDetail(null);
    setIsDictDataDetailDrawerVisible(false);
  };

  // 表格列信息
  const dictDataPageColumns: ColumnsType<DictDataPage> = [
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
      render: (_: number, _record: DictDataPage, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "字典排序",
      dataIndex: "sort",
      key: "sort",
      width: "6%",
    },
    {
      title: "字典标签",
      dataIndex: "label",
      key: "label",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "字典键值",
      dataIndex: "value",
      key: "value",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "字典类型",
      dataIndex: "type",
      key: "type",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "是否默认",
      dataIndex: "is_default",
      key: "is_default",
      width: "6%",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "6%",
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
            onClick={ () => onDictDataDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onDictDataModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleDictDataDelete(record)}
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

  const [visibleColumns, setVisibleColumns] = useState(dictDataPageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredDictDataColumns = dictDataPageColumns.filter(col => visibleColumns.includes(col.key));

  const [dictDataQueryForm] = Form.useForm();
  const handleDictDataQueryReset = () => {
    resetPagination();
    dictDataQueryForm.resetFields();
  };
  const onDictDataQueryFinish = async () => {
    const dictDataQueryFormData = dictDataQueryForm.getFieldsValue();
    const { create_time } = dictDataQueryFormData
    if (create_time) {
      const [startDate, endDate] = create_time
      dictDataQueryFormData.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    const dictDataQuery = dictDataQueryFormData as DictDataQuery;
    const filteredDictDataQuery = Object.fromEntries(
      Object.entries(dictDataQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleDictDataQueryFinish(filteredDictDataQuery as DictDataQuery);
  };
  const handleDictDataQueryFinish = async (dictDataQuery: DictDataQuery) => {
    await fetchDictDataByPage(BaseQueryImpl.create(current, pageSize), dictDataQuery).then((resp) => {
      setDictDataPageDataSource(resp.records);
      setDictDataPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isDictDataCreateModalVisible, setIsDictDataCreateModalVisible] = useState(false);
  const [isDictDataCreateLoading, setIsDictDataCreateLoading] = useState(false);
  const [dictDataCreateForm] = Form.useForm();

  const [dictType, setDictType] = useState(queryParams.get('type'));
  dictDataCreateForm.setFieldValue('type', dictType);
  const navigate = useNavigate()
  if (dictType === null || dictType === undefined) {
    navigate('/system/dict-type');
  }
  const onDictTypeChange = (value: string) => {
    setDictType(value)
    dictDataCreateForm.setFieldValue('type', value);
  };
  const onDictDataCreate = () => {
    setIsDictDataCreateModalVisible(true);
  };
  const handleDictDataCreateCancel = () => {
    dictDataCreateForm.resetFields();
    setIsDictDataCreateModalVisible(false);
  };
  const handleDictDataCreateFinish = async (dictDataCreate: DictDataCreate) => {
    setIsDictDataCreateLoading(true);
    try {
      await createDictData(dictDataCreate);
      message.success("新增成功");
      dictDataCreateForm.resetFields();
      await onDictDataQueryFinish();
    } finally {
      setIsDictDataCreateLoading(false);
      setIsDictDataCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleDictDataDelete = async (dictDataPage: DictDataPage) => {
    await removeDictData(dictDataPage.id);
    await onDictDataQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DictDataPage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: DictDataPage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleDictDataBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveDictData(selectedRows.map((row) => row.id));
      await onDictDataQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleDictDataBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isDictDataModifyModalVisible, setIsDictDataModifyModalVisible] = useState<boolean>(false);
  const [isDictDataModifyLoading, setIsDictDataModifyLoading] = useState<boolean>(false);
  const [dictDataModifyForm] = Form.useForm();
  const onDictDataModify = (dictDataPage: DictDataPage) => {
    setIsDictDataModifyModalVisible(true);
    setSelectedRowKeys([dictDataPage.id])
    setSelectedRows([dictDataPage])
    dictDataModifyForm.setFieldsValue({ ...dictDataPage });
  };

  const handleDictDataModifyCancel = () => {
    resetSelectedRows();
    dictDataModifyForm.resetFields();
    setIsDictDataModifyModalVisible(false);
  };
  const handleDictDataModifyFinish = async () => {
    const dictDataModifyData = (await dictDataModifyForm.validateFields()) as DictDataModify;
    const dictDataModify = {...dictDataModifyData, id: selectedRows[0].id};
    setIsDictDataModifyLoading(true);
    try {
      await modifyDictData(dictDataModify);
      dictDataModifyForm.resetFields();
      message.success("更新成功");
      await onDictDataQueryFinish();
      resetSelectedRows();
    } finally {
      setIsDictDataModifyLoading(false);
      setIsDictDataModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onDictDataBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsDictDataModifyModalVisible(true);
      dictDataModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsDictDataBatchModifyModalVisible(true);
      dictDataBatchModifyForm.resetFields();
    }
  };
  const [isDictDataBatchModifyModalVisible, setIsDictDataBatchModifyModalVisible] = useState<boolean>(false);
  const [isDictDataBatchModifyLoading, setIsDictDataBatchModifyLoading] = useState<boolean>(false);
  const [dictDataBatchModifyForm] = Form.useForm();
  const handleDictDataBatchModifyCancel = async () => {
    dictDataBatchModifyForm.resetFields();
    setIsDictDataBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleDictDataBatchModifyFinish = async () => {
    const dictDataBatchModify = (await dictDataBatchModifyForm.validateFields()) as DictDataBatchModify;
    setIsDictDataBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      dictDataBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyDictData(dictDataBatchModify);
      dictDataBatchModifyForm.resetFields();
      message.success("更新成功");
      await onDictDataQueryFinish();
      resetSelectedRows();
    } finally {
      setIsDictDataBatchModifyLoading(false);
      setIsDictDataBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isDictDataImportModalVisible, setIsDictDataImportModalVisible] = useState<boolean>(false);
  const [isDictDataImportLoading, setIsDictDataImportLoading] = useState<boolean>(false);
  const [dictDataCreateList, setDictDataCreateList] = useState<DictDataCreate[]>([]);

  const onDictDataImport = () => {
    setIsDictDataImportModalVisible(true);
  };
  const handleDictDataImportCancel = () => {
    setIsDictDataImportModalVisible(false);
  };
  const onDictDataImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsDictDataImportLoading(true);
      const dictDataCreateList = await importDictData(fileList[0]);
      setDictDataCreateList(dictDataCreateList);
      return dictDataCreateList;
    } finally {
      setIsDictDataImportLoading(false);
    }
  };

  const handleDictDataImport = async () => {
    setIsDictDataImportLoading(true);
    try {
      await batchCreateDictData(dictDataCreateList);
      message.success("导入成功");
      setIsDictDataImportModalVisible(false);
      await onDictDataQueryFinish();
    } finally {
      setIsDictDataImportLoading(false);
      setDictDataCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onDictDataExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportDictDataPage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isDictDataQueryShow}>
        <div className="shadow-sm">
          <DictDataQueryComponent
            onDictDataQueryFinish={onDictDataQueryFinish}
            onDictDataQueryReset={handleDictDataQueryReset}
            onDictTypeChange={onDictTypeChange}
            dictDataQueryForm={ dictDataQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onDictDataCreate}
          onImport={onDictDataImport}
          onExport={onDictDataExport}
          onBatchModify={onDictDataBatchModify}
          onConfirmBatchRemove={handleDictDataBatchRemove}
          onConfirmBatchRemoveCancel={handleDictDataBatchRemoveCancel}
          isQueryShow={isDictDataQueryShow}
          onQueryShow={onDictDataQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ dictDataPageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<DictDataPage>
          columns={ filteredDictDataColumns}
          dataSource={ dictDataPageDataSource}
          total={ dictDataPageTotalCount}
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
          <DictDataCreateComponent
            isDictDataCreateModalVisible={isDictDataCreateModalVisible}
            onDictDataCreateCancel={handleDictDataCreateCancel}
            onDictDataCreateFinish={handleDictDataCreateFinish}
            isDictDataCreateLoading={isDictDataCreateLoading}
            dictDataCreateForm={ dictDataCreateForm}
          />
        </div>
        <div>
          <DictDataDetailComponent
            isDictDataDetailDrawerVisible={isDictDataDetailDrawerVisible}
            onDictDataDetailClose={onDictDataDetailClose}
            dictDataDetail={ dictDataDetail}
          />
        </div>
        <div>
          <DictDataModifyComponent
            isDictDataModifyModalVisible={isDictDataModifyModalVisible}
            onDictDataModifyCancel={handleDictDataModifyCancel}
            onDictDataModifyFinish={handleDictDataModifyFinish}
            isDictDataModifyLoading={isDictDataModifyLoading}
            dictDataModifyForm={ dictDataModifyForm}
          />
        </div>
        <div>
          <DictDataBatchModifyComponent
            isDictDataBatchModifyModalVisible={isDictDataBatchModifyModalVisible}
            onDictDataBatchModifyCancel={handleDictDataBatchModifyCancel}
            onDictDataBatchModifyFinish={handleDictDataBatchModifyFinish}
            isDictDataBatchModifyLoading={isDictDataBatchModifyLoading}
            dictDataBatchModifyForm={ dictDataBatchModifyForm}
          />
        </div>
        <div>
          <DictDataImportComponent
            isDictDataImportModalVisible={isDictDataImportModalVisible}
            isDictDataImportLoading={isDictDataImportLoading}
            onDictDataImportFinish={onDictDataImportFinish}
            onDictDataImportCancel={handleDictDataImportCancel}
            handleDictDataImport={handleDictDataImport}
          />
        </div>
      </div>
    </div>
  );
};

export default DictData;
