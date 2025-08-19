import { exportMenuTemplate } from '@/service/menu';
import { CreateMenu, ImportMenu, ImportMenusResponse } from '@/types/menu';
import { Button, Modal, Table, Upload, UploadFile, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Inbox } from 'lucide-react';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ImportMenuProps {
  isImportMenuModalVisible: boolean;
  isImportMenuLoading: boolean;
  onImportMenuCancel: () => void;
  onImportMenuFinish: (fileList: RcFile[]) => Promise<ImportMenusResponse>;
  handleImportMenu: () => void;
}

const ImportMenuComponent: React.FC<ImportMenuProps> = ({
  isImportMenuModalVisible,
  onImportMenuCancel,
  onImportMenuFinish,
  isImportMenuLoading,
  handleImportMenu,
}) => {
  const [ImportMenuFileList, setImportMenuFileList] = useState<RcFile[]>([]);
  const [MenuCreateList, setMenuCreateList] = useState<ImportMenu[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleImportMenuCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={isImportMenuLoading}
      onClick={handleImportMenuConfirm}
    >
      确定
    </Button>,
  ];

  const handleImportMenuConfirm = async () => {
    if (isUploadShow) {
      if (ImportMenuFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const importMenusResponse =
          await onImportMenuFinish(ImportMenuFileList);
        setIsUploadShow(false);
        setMenuCreateList(importMenusResponse.menus);
      } finally {
        setImportMenuFileList([]);
      }
    } else {
      handleImportMenu();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const MenuPageColumns: ColumnsType<CreateMenu> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: CreateMenu, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '错误信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
      render: (text) => (text ? text : '--'),
    },
  ];

  const handleMenuExportTemplate = async () => {
    await exportMenuTemplate();
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
    setImportMenuFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setImportMenuFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleImportMenuCancel = () => {
    onImportMenuCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="系统菜单导入"
      open={isImportMenuModalVisible}
      onCancel={handleImportMenuCancel}
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
              fileList={ImportMenuFileList}
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
            onClick={handleMenuExportTemplate}
            className="cursor-pointer mt-4 text-blue-600"
          >
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={MenuPageColumns}
            dataSource={MenuCreateList}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default ImportMenuComponent;
