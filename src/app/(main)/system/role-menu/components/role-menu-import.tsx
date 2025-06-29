import { message } from '@/components/GlobalToast';
import { exportRoleMenuTemplate } from '@/service/role-menu';
import { RoleMenuCreate } from '@/types/role-menu';
import { Inbox as InboxOutlined } from 'lucide-react';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface RoleMenuImportProps {
  isRoleMenuImportModalVisible: boolean;
  isRoleMenuImportLoading: boolean;
  onRoleMenuImportCancel: () => void;
  onRoleMenuImportFinish: (fileList: RcFile[]) => Promise<RoleMenuCreate[]>;
  handleRoleMenuImport: () => void;
}

const RoleMenuImportComponent: React.FC<RoleMenuImportProps> = ({
  isRoleMenuImportModalVisible,
  onRoleMenuImportCancel,
  onRoleMenuImportFinish,
  isRoleMenuImportLoading,
  handleRoleMenuImport,
}) => {
  const [RoleMenuImportFileList, setRoleMenuImportFileList] = useState<RcFile[]>([]);
  const [RoleMenuCreateList, setRoleMenuCreateList] = useState<RoleMenuCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleRoleMenuImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isRoleMenuImportLoading} onClick={handleRoleMenuImportConfirm}>
      确定
    </Button>,
  ];

  const handleRoleMenuImportConfirm = async () => {
    if (isUploadShow) {
      if (RoleMenuImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const RoleMenuPageList = await onRoleMenuImportFinish(RoleMenuImportFileList);
        setIsUploadShow(false);
        setRoleMenuCreateList(RoleMenuPageList as RoleMenuCreate[]);
      } finally {
        setRoleMenuImportFileList([]);
      }
    } else {
      handleRoleMenuImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const RoleMenuPageColumns: ColumnsType<RoleMenuCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: RoleMenuCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "角色ID",
      dataIndex: "role_id",
      key: "role_id",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "菜单ID",
      dataIndex: "menu_id",
      key: "menu_id",
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

  const handleRoleMenuExportTemplate = async () => {
    await exportRoleMenuTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setRoleMenuImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setRoleMenuImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleRoleMenuImportCancel = () => {
    onRoleMenuImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="角色和菜单关联导入"
      open={isRoleMenuImportModalVisible}
      onCancel={handleRoleMenuImportCancel}
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
              fileList={ RoleMenuImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleRoleMenuExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ RoleMenuPageColumns}
            dataSource={ RoleMenuCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default RoleMenuImportComponent;