import { RoleMenuDetail } from '@/types/role-menu';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface RoleMenuDetailDrawerProps {
  isRoleMenuDetailDrawerVisible: boolean;
  onRoleMenuDetailClose: () => void;
  roleMenuDetail: RoleMenuDetail | null;
}

const RoleMenuDetailComponent: React.FC<RoleMenuDetailDrawerProps> = ({
                                                                     isRoleMenuDetailDrawerVisible,
                                                                     onRoleMenuDetailClose,
                                                                     roleMenuDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onRoleMenuDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onRoleMenuDetailClose],
  );

  return (
    <Drawer
      title="角色和菜单关联详情"
      open={isRoleMenuDetailDrawerVisible}
      onClose={onRoleMenuDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { roleMenuDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="角色ID">{ roleMenuDetail.role_id}</Descriptions.Item>
          <Descriptions.Item label="菜单ID">{ roleMenuDetail.menu_id}</Descriptions.Item>
          <Descriptions.Item label="创建者">{ roleMenuDetail.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ roleMenuDetail.create_time}</Descriptions.Item>
          <Descriptions.Item label="更新者">{ roleMenuDetail.updater}</Descriptions.Item>
          <Descriptions.Item label="">{ roleMenuDetail.deleted}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default RoleMenuDetailComponent;
