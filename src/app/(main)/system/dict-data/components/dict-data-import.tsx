import { message } from '@/components/GlobalToast';
import { exportDictDataTemplate } from '@/service/dict-data';
import { DictDataCreate } from '@/types/dict-data';
import { Inbox as InboxOutlined } from 'lucide-react';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface DictDataImportProps {
  isDictDataImportModalVisible: boolean;
  isDictDataImportLoading: boolean;
  onDictDataImportCancel: () => void;
  onDictDataImportFinish: (fileList: RcFile[]) => Promise<DictDataCreate[]>;
  handleDictDataImport: () => void;
}

const DictDataImportComponent: React.FC<DictDataImportProps> = ({
  isDictDataImportModalVisible,
  onDictDataImportCancel,
  onDictDataImportFinish,
  isDictDataImportLoading,
  handleDictDataImport,
}) => {
  const [dictDataImportFileList, setDictDataImportFileList] = useState<RcFile[]>([]);
  const [DictDataCreateList, setDictDataCreateList] = useState<DictDataCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleDictDataImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isDictDataImportLoading} onClick={handleDictDataImportConfirm}>
      确定
    </Button>,
  ];

  const handleDictDataImportConfirm = async () => {
    if (isUploadShow) {
      if (dictDataImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const DictDataPageList = await onDictDataImportFinish(dictDataImportFileList);
        setIsUploadShow(false);
        setDictDataCreateList(DictDataPageList as DictDataCreate[]);
      } finally {
        setDictDataImportFileList([]);
      }
    } else {
      handleDictDataImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const DictDataPageColumns: ColumnsType<DictDataCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: DictDataCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "字典排序",
      dataIndex: "sort",
      key: "sort",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "字典标签",
      dataIndex: "label",
      key: "label",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "字典键值",
      dataIndex: "value",
      key: "value",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "字典类型",
      dataIndex: "type",
      key: "type",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "是否默认",
      dataIndex: "is_default",
      key: "is_default",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "错误信息",
      dataIndex: "errMsg",
      key: "errMsg",
      render: (text) => (text ? text : "-"),
    },
  ];

  const handleDictDataExportTemplate = async () => {
    await exportDictDataTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setDictDataImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setDictDataImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleDictDataImportCancel = () => {
    onDictDataImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="字典数据导入"
      open={isDictDataImportModalVisible}
      onCancel={handleDictDataImportCancel}
      footer={footerButtons}
      width={'70%'}
    >
      {isUploadShow ? (
        <div>
          <div>
            <Upload.Dragger
              name="file"
              multiple
              accept=".xlsx,.xls"
              onRemove={handleRemove}
              fileList={ dictDataImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleDictDataExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ DictDataPageColumns}
            dataSource={ DictDataCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default DictDataImportComponent;