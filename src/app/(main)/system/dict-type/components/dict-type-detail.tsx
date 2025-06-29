import { DictTypeDetail } from '@/types/dict-type';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface DictTypeDetailDrawerProps {
  isDictTypeDetailDrawerVisible: boolean;
  onDictTypeDetailClose: () => void;
  dictTypeDetail: DictTypeDetail | null;
}

const DictTypeDetailComponent: React.FC<DictTypeDetailDrawerProps> = ({
                                                                     isDictTypeDetailDrawerVisible,
                                                                     onDictTypeDetailClose,
                                                                     dictTypeDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onDictTypeDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onDictTypeDetailClose],
  );

  return (
    <Drawer
      title="字典类型详情"
      open={isDictTypeDetailDrawerVisible}
      onClose={onDictTypeDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { dictTypeDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="字典名称">{ dictTypeDetail.name}</Descriptions.Item>
          <Descriptions.Item label="字典类型">{ dictTypeDetail.type}</Descriptions.Item>
          <Descriptions.Item label="状态">{ dictTypeDetail.status}</Descriptions.Item>
          <Descriptions.Item label="备注">{ dictTypeDetail.comment}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ dictTypeDetail.create_time}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default DictTypeDetailComponent;
