import { DictDataDetail } from '@/types/dict-data';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface DictDataDetailDrawerProps {
  isDictDataDetailDrawerVisible: boolean;
  onDictDataDetailClose: () => void;
  dictDataDetail: DictDataDetail | null;
}

const DictDataDetailComponent: React.FC<DictDataDetailDrawerProps> = ({
                                                                     isDictDataDetailDrawerVisible,
                                                                     onDictDataDetailClose,
                                                                     dictDataDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onDictDataDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onDictDataDetailClose],
  );

  return (
    <Drawer
      title="字典数据详情"
      open={isDictDataDetailDrawerVisible}
      onClose={onDictDataDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { dictDataDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="字典排序">{ dictDataDetail.sort}</Descriptions.Item>
          <Descriptions.Item label="字典标签">{ dictDataDetail.label}</Descriptions.Item>
          <Descriptions.Item label="字典键值">{ dictDataDetail.value}</Descriptions.Item>
          <Descriptions.Item label="字典类型">{ dictDataDetail.type}</Descriptions.Item>
          <Descriptions.Item label="回显样式">{ dictDataDetail.echo_style}</Descriptions.Item>
          <Descriptions.Item label="扩展样式">{ dictDataDetail.ext_class}</Descriptions.Item>
          <Descriptions.Item label="是否默认">{ dictDataDetail.is_default}</Descriptions.Item>
          <Descriptions.Item label="状态">{ dictDataDetail.status}</Descriptions.Item>
          <Descriptions.Item label="备注">{ dictDataDetail.comment}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ dictDataDetail.create_time}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default DictDataDetailComponent;
