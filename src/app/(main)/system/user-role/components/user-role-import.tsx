import { message } from '@/components/GlobalToast';
import { exportUserRoleTemplate } from '@/service/user-role';
import { UserRoleCreate } from '@/types/user-role';
import { Inbox as InboxOutlined } from 'lucide-react';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface UserRoleImportProps {
  isUserRoleImportModalVisible: boolean;
  isUserRoleImportLoading: boolean;
  onUserRoleImportCancel: () => void;
  onUserRoleImportFinish: (fileList: RcFile[]) => Promise<UserRoleCreate[]>;
  handleUserRoleImport: () => void;
}

const UserRoleImportComponent: React.FC<UserRoleImportProps> = ({
  isUserRoleImportModalVisible,
  onUserRoleImportCancel,
  onUserRoleImportFinish,
  isUserRoleImportLoading,
  handleUserRoleImport,
}) => {
  const [UserRoleImportFileList, setUserRoleImportFileList] = useState<RcFile[]>([]);
  const [UserRoleCreateList, setUserRoleCreateList] = useState<UserRoleCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleUserRoleImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isUserRoleImportLoading} onClick={handleUserRoleImportConfirm}>
      确定
    </Button>,
  ];

  const handleUserRoleImportConfirm = async () => {
    if (isUploadShow) {
      if (UserRoleImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const UserRolePageList = await onUserRoleImportFinish(UserRoleImportFileList);
        setIsUploadShow(false);
        setUserRoleCreateList(UserRolePageList as UserRoleCreate[]);
      } finally {
        setUserRoleImportFileList([]);
      }
    } else {
      handleUserRoleImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const UserRolePageColumns: ColumnsType<UserRoleCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: UserRoleCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "角色ID",
      dataIndex: "role_id",
      key: "role_id",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "创建者",
      dataIndex: "creator",
      key: "creator",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "更新者",
      dataIndex: "updater",
      key: "updater",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "",
      dataIndex: "deleted",
      key: "deleted",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "错误信息",
      dataIndex: "errMsg",
      key: "errMsg",
      render: (text) => (text ? text : "-"),
    },
  ];

  const handleUserRoleExportTemplate = async () => {
    await exportUserRoleTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setUserRoleImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setUserRoleImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleUserRoleImportCancel = () => {
    onUserRoleImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="用户和角色关联导入"
      open={isUserRoleImportModalVisible}
      onCancel={handleUserRoleImportCancel}
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
              fileList={ UserRoleImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleUserRoleExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ UserRolePageColumns}
            dataSource={ UserRoleCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default UserRoleImportComponent;