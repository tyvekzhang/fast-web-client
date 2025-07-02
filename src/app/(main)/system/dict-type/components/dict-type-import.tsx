import { message } from '@/components/GlobalToast';
import { exportDictTypeTemplate } from '@/service/dict-type';
import { DictTypeCreate } from '@/types/dict-type';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Inbox as InboxOutlined } from 'lucide-react';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface DictTypeImportProps {
  isDictTypeImportModalVisible: boolean;
  isDictTypeImportLoading: boolean;
  onDictTypeImportCancel: () => void;
  onDictTypeImportFinish: (fileList: RcFile[]) => Promise<DictTypeCreate[]>;
  handleDictTypeImport: () => void;
}

const DictTypeImportComponent: React.FC<DictTypeImportProps> = ({
  isDictTypeImportModalVisible,
  onDictTypeImportCancel,
  onDictTypeImportFinish,
  isDictTypeImportLoading,
  handleDictTypeImport,
}) => {
  const [dictTypeImportFileList, setDictTypeImportFileList] = useState<
    RcFile[]
  >([]);
  const [DictTypeCreateList, setDictTypeCreateList] = useState<
    DictTypeCreate[]
  >([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleDictTypeImportCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={isDictTypeImportLoading}
      onClick={handleDictTypeImportConfirm}
    >
      确定
    </Button>,
  ];

  const handleDictTypeImportConfirm = async () => {
    if (isUploadShow) {
      if (dictTypeImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const DictTypePageList = await onDictTypeImportFinish(
          dictTypeImportFileList,
        );
        setIsUploadShow(false);
        setDictTypeCreateList(DictTypePageList as DictTypeCreate[]);
      } finally {
        setDictTypeImportFileList([]);
      }
    } else {
      handleDictTypeImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const DictTypePageColumns: ColumnsType<DictTypeCreate> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: DictTypeCreate, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '错误信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
      render: (text) => (text ? text : '-'),
    },
  ];

  const handleDictTypeExportTemplate = async () => {
    await exportDictTypeTemplate();
  };

  const customUploadRequest = async (
    options: UploadRequestOption,
  ): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setDictTypeImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setDictTypeImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleDictTypeImportCancel = () => {
    onDictTypeImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="字典类型导入"
      open={isDictTypeImportModalVisible}
      onCancel={handleDictTypeImportCancel}
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
              fileList={dictTypeImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div
            onClick={handleDictTypeExportTemplate}
            className="cursor-pointer mt-4 text-blue-600"
          >
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={DictTypePageColumns}
            dataSource={DictTypeCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default DictTypeImportComponent;
