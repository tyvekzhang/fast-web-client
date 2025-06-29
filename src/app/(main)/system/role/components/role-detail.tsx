import { RoleDetail } from '@/types/role';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface RoleDetailDrawerProps {
  isRoleDetailDrawerVisible: boolean;
  onRoleDetailClose: () => void;
  roleDetail: RoleDetail | null;
}

const RoleDetailComponent: React.FC<RoleDetailDrawerProps> = ({
                                                                     isRoleDetailDrawerVisible,
                                                                     onRoleDetailClose,
                                                                     roleDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onRoleDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onRoleDetailClose],
  );

  return (
    <Drawer
      title="角色信息详情"
      open={isRoleDetailDrawerVisible}
      onClose={onRoleDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { roleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="角色名称">{ roleDetail.name}</Descriptions.Item>
          <Descriptions.Item label="角色权限字符串">{ roleDetail.code}</Descriptions.Item>
          <Descriptions.Item label="显示顺序">{ roleDetail.sort}</Descriptions.Item>
          <Descriptions.Item label="数据范围">{ roleDetail.data_scope}</Descriptions.Item>
          <Descriptions.Item label="数据范围">{ roleDetail.data_scope_dept_ids}</Descriptions.Item>
          <Descriptions.Item label="角色状态">{ roleDetail.status}</Descriptions.Item>
          <Descriptions.Item label="备注">{ roleDetail.comment}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ roleDetail.create_time}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default RoleDetailComponent;
