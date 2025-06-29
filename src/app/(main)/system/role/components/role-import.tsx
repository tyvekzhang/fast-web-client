import { message } from '@/components/GlobalToast';
import { exportRoleTemplate } from '@/service/role';
import { RoleCreate } from '@/types/role';
import { Inbox as InboxOutlined } from 'lucide-react';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface RoleImportProps {
  isRoleImportModalVisible: boolean;
  isRoleImportLoading: boolean;
  onRoleImportCancel: () => void;
  onRoleImportFinish: (fileList: RcFile[]) => Promise<RoleCreate[]>;
  handleRoleImport: () => void;
}

const RoleImportComponent: React.FC<RoleImportProps> = ({
  isRoleImportModalVisible,
  onRoleImportCancel,
  onRoleImportFinish,
  isRoleImportLoading,
  handleRoleImport,
}) => {
  const [RoleImportFileList, setRoleImportFileList] = useState<RcFile[]>([]);
  const [RoleCreateList, setRoleCreateList] = useState<RoleCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleRoleImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isRoleImportLoading} onClick={handleRoleImportConfirm}>
      确定
    </Button>,
  ];

  const handleRoleImportConfirm = async () => {
    if (isUploadShow) {
      if (RoleImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const RolePageList = await onRoleImportFinish(RoleImportFileList);
        setIsUploadShow(false);
        setRoleCreateList(RolePageList as RoleCreate[]);
      } finally {
        setRoleImportFileList([]);
      }
    } else {
      handleRoleImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const RolePageColumns: ColumnsType<RoleCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: RoleCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "角色权限字符串",
      dataIndex: "code",
      key: "code",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "显示顺序",
      dataIndex: "sort",
      key: "sort",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "角色状态",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "错误信息",
      dataIndex: "errMsg",
      key: "errMsg",
      render: (text) => (text ? text : "-"),
    },
  ];

  const handleRoleExportTemplate = async () => {
    await exportRoleTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setRoleImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setRoleImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleRoleImportCancel = () => {
    onRoleImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="角色信息导入"
      open={isRoleImportModalVisible}
      onCancel={handleRoleImportCancel}
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
              fileList={ RoleImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleRoleExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ RolePageColumns}
            dataSource={ RoleCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default RoleImportComponent;