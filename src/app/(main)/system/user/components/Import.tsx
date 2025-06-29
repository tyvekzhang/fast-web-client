"use client"
import { message } from '@/components/GlobalToast';
import { userExportTemplate } from '@/service/user';
import { Inbox as InboxOutlined } from 'lucide-react';
import { Button, Modal, Upload, UploadFile } from 'antd';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ImportProps {
  isModalVisible: boolean;
  isLoading: boolean;
  handleCancel: () => void;
  handleUserImport: () => void;
  handleFileUpload: (file: RcFile | null) => void;
}

const Import: React.FC<ImportProps> = ({
  isModalVisible,
  handleCancel,
  handleUserImport,
  isLoading,
  handleFileUpload,
}) => {
  const [fileList, setFileList] = useState<UploadFile<any>[] | undefined>(undefined);
  const clearFileList = () => {
    setFileList([]);
    handleFileUpload(null);
  };
  const footerButtons = () => [
    <Button
      key="back"
      onClick={() => {
        handleCancel();
        clearFileList();
      }}
    >
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isLoading} onClick={handleUserImport}>
      确定
    </Button>,
  ];
  const handleUserExportTemplate = async () => {
    await userExportTemplate();
  };
  const customUploadRequest = (options: UploadRequestOption): void | undefined => {
    const { onSuccess, onError } = options;
    const file = options.file as RcFile;
    if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      handleFileUpload(null);
      setFileList(undefined);
      return;
    }
    handleFileUpload(file);
    setFileList([file]);
    setTimeout(() => {
      onSuccess?.(file);
    }, 300);
  };

  return (
    <div>
      <Modal
        title="用户导入"
        open={isModalVisible}
        onCancel={() => {
          handleCancel();
          clearFileList();
        }}
        onOk={handleUserImport}
        footer={footerButtons}
      >
        <div>
          <Upload.Dragger
            name="file"
            maxCount={1}
            accept=".xlsx,.xls"
            onRemove={clearFileList}
            fileList={fileList}
            customRequest={customUploadRequest as any}
          >
            <p className="sc-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
            <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
          </Upload.Dragger>
        </div>
        <div>
          <Button type={'link'} onClick={handleUserExportTemplate}>
            下载模板
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Import;
