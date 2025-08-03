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
import { exportRoleTemplate } from '@/service/role';
import { CreateRole, ImportRolesResponse } from '@/types/role';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, UploadFile, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ImportRoleProps {
  isImportRoleModalVisible: boolean;
  isImportRoleLoading: boolean;
  onImportRoleCancel: () => void;
  onImportRoleFinish: (fileList: RcFile[]) => Promise<ImportRolesResponse>;
  handleImportRole: () => void;
}

const ImportRoleComponent: React.FC<ImportRoleProps> = ({
  isImportRoleModalVisible,
  onImportRoleCancel,
  onImportRoleFinish,
  isImportRoleLoading,
  handleImportRole,
}) => {
  const [roleImportFileList, setImportRoleFileList] = useState<RcFile[]>([]);
  const [CreateRoleList, setCreateRoleList] = useState<CreateRole[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleImportRoleCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={isImportRoleLoading}
      onClick={handleImportRoleConfirm}
    >
      确定
    </Button>,
  ];

  const handleImportRoleConfirm = async () => {
    if (isUploadShow) {
      if (roleImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const importRoleResponse = await onImportRoleFinish(roleImportFileList);
        setIsUploadShow(false);
        setCreateRoleList(importRoleResponse.roles);
      } finally {
        setImportRoleFileList([]);
      }
    } else {
      handleImportRole();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const RoleColumns: ColumnsType<CreateRole> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: CreateRole, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: '错误信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
      render: (text) => (text ? text : '-'),
    },
  ];

  const handleRoleExportTemplate = async () => {
    await exportRoleTemplate();
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
    setImportRoleFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setImportRoleFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleImportRoleCancel = () => {
    onImportRoleCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="角色信息导入"
      open={isImportRoleModalVisible}
      onCancel={handleImportRoleCancel}
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
              fileList={roleImportFileList}
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
            onClick={handleRoleExportTemplate}
            className="cursor-pointer mt-4 text-blue-600"
          >
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={RoleColumns}
            dataSource={CreateRoleList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default ImportRoleComponent;
