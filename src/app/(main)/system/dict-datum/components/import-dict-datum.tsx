// Copyright (c) 2025 FastWeb and/or its affiliates. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { exportDictDatumTemplate } from '@/service/dict-datum';
import { CreateDictDatum, ImportDictDataResponse } from '@/types/dict-datum';
import { Button, Modal, Table, Upload, UploadFile, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Inbox } from 'lucide-react';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ImportDictDatumProps {
  isImportDictDatumModalVisible: boolean;
  isImportDictDatumLoading: boolean;
  onImportDictDatumCancel: () => void;
  onImportDictDatumFinish: (
    fileList: RcFile[],
  ) => Promise<ImportDictDataResponse>;
  handleImportDictDatum: () => void;
}

const ImportDictDatumComponent: React.FC<ImportDictDatumProps> = ({
  isImportDictDatumModalVisible,
  onImportDictDatumCancel,
  onImportDictDatumFinish,
  isImportDictDatumLoading,
  handleImportDictDatum,
}) => {
  const [dictDatumImportFileList, setImportDictDatumFileList] = useState<
    RcFile[]
  >([]);
  const [CreateDictDatumList, setCreateDictDatumList] = useState<
    CreateDictDatum[]
  >([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleImportDictDatumCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={isImportDictDatumLoading}
      onClick={handleImportDictDatumConfirm}
    >
      确定
    </Button>,
  ];

  const handleImportDictDatumConfirm = async () => {
    if (isUploadShow) {
      if (dictDatumImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const importDictDatumResponse = await onImportDictDatumFinish(
          dictDatumImportFileList,
        );
        setIsUploadShow(false);
        setCreateDictDatumList(importDictDatumResponse.dictData);
      } finally {
        setImportDictDatumFileList([]);
      }
    } else {
      handleImportDictDatum();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const DictDatumColumns: ColumnsType<CreateDictDatum> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: CreateDictDatum, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (text ? text : '-'),
    },

    {
      title: '字典标签',
      dataIndex: 'label',
      key: 'label',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '字典键值',
      dataIndex: 'value',
      key: 'value',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '字典排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '错误信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
      render: (text) => (text ? text : '-'),
    },
  ];

  const handleDictDatumExportTemplate = async () => {
    await exportDictDatumTemplate();
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
    setImportDictDatumFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setImportDictDatumFileList((prev) =>
      prev.filter((f) => f.uid !== file.uid),
    );
  };

  const handleImportDictDatumCancel = () => {
    onImportDictDatumCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="字典数据导入"
      open={isImportDictDatumModalVisible}
      onCancel={handleImportDictDatumCancel}
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
              fileList={dictDatumImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="flex justify-center items-center text-primary">
                <Inbox />
              </p>
              <p>{'点击或拖拽到此上传'}</p>
              <p className="text-gray-500">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div
            onClick={handleDictDatumExportTemplate}
            className="cursor-pointer mt-4 text-blue-600"
          >
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={DictDatumColumns}
            dataSource={CreateDictDatumList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default ImportDictDatumComponent;
