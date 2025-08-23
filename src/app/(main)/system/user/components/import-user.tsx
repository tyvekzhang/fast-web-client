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
import { exportUserTemplate } from '@/service/user';
import { CreateUser, ImportUsersResponse } from '@/types/user';
import { Button, Modal, Table, Upload, UploadFile, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Inbox } from 'lucide-react';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ImportUserProps {
  isImportUserModalVisible: boolean;
  isImportUserLoading: boolean;
  onImportUserCancel: () => void;
  onImportUserFinish: (fileList: RcFile[]) => Promise<ImportUsersResponse>;
  handleImportUser: () => void;
}

const ImportUserComponent: React.FC<ImportUserProps> = ({
  isImportUserModalVisible,
  onImportUserCancel,
  onImportUserFinish,
  isImportUserLoading,
  handleImportUser,
}) => {
  const [userImportFileList, setImportUserFileList] = useState<RcFile[]>([]);
  const [CreateUserList, setCreateUserList] = useState<CreateUser[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleImportUserCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={isImportUserLoading}
      onClick={handleImportUserConfirm}
    >
      确定
    </Button>,
  ];

  const handleImportUserConfirm = async () => {
    if (isUploadShow) {
      if (userImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const importUserResponse = await onImportUserFinish(userImportFileList);
        setIsUploadShow(false);
        setCreateUserList(importUserResponse.users);
      } finally {
        setImportUserFileList([]);
      }
    } else {
      handleImportUser();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const UserColumns: ColumnsType<CreateUser> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: CreateUser, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '头像地址',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
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
      dataIndex: 'remark',
      key: 'remark',
      render: (text) => (text ? text : '-'),
    },
    {
      title: '错误信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
      render: (text) => (text ? text : '-'),
    },
  ];

  const handleUserExportTemplate = async () => {
    await exportUserTemplate();
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
    setImportUserFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setImportUserFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleImportUserCancel = () => {
    onImportUserCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="用户信息导入"
      open={isImportUserModalVisible}
      onCancel={handleImportUserCancel}
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
              fileList={userImportFileList}
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
            onClick={handleUserExportTemplate}
            className="cursor-pointer mt-4 text-blue-600"
          >
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={UserColumns}
            dataSource={CreateUserList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default ImportUserComponent;
