import { message } from '@/components/GlobalToast';
import { exportMenuTemplate } from '@/service/menu';
import { MenuCreate } from '@/types/menu';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface MenuImportProps {
  isMenuImportModalVisible: boolean;
  isMenuImportLoading: boolean;
  onMenuImportCancel: () => void;
  onMenuImportFinish: (fileList: RcFile[]) => Promise<MenuCreate[]>;
  handleMenuImport: () => void;
}

const MenuImportComponent: React.FC<MenuImportProps> = ({
  isMenuImportModalVisible,
  onMenuImportCancel,
  onMenuImportFinish,
  isMenuImportLoading,
  handleMenuImport,
}) => {
  const [MenuImportFileList, setMenuImportFileList] = useState<RcFile[]>([]);
  const [MenuCreateList, setMenuCreateList] = useState<MenuCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleMenuImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isMenuImportLoading} onClick={handleMenuImportConfirm}>
      确定
    </Button>,
  ];

  const handleMenuImportConfirm = async () => {
    if (isUploadShow) {
      if (MenuImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const MenuPageList = await onMenuImportFinish(MenuImportFileList);
        setIsUploadShow(false);
        setMenuCreateList(MenuPageList as MenuCreate[]);
      } finally {
        setMenuImportFileList([]);
      }
    } else {
      handleMenuImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const MenuPageColumns: ColumnsType<MenuCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: MenuCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "权限标识",
      dataIndex: "permission",
      key: "permission",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "路由地址",
      dataIndex: "path",
      key: "path",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "组件路径",
      dataIndex: "component",
      key: "component",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
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

  const handleMenuExportTemplate = async () => {
    await exportMenuTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setMenuImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setMenuImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleMenuImportCancel = () => {
    onMenuImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="系统菜单导入"
      open={isMenuImportModalVisible}
      onCancel={handleMenuImportCancel}
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
              fileList={ MenuImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleMenuExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ MenuPageColumns}
            dataSource={ MenuCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default MenuImportComponent;