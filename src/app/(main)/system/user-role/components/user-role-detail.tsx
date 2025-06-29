import { UserRoleDetail } from '@/types/user-role';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface UserRoleDetailDrawerProps {
  isUserRoleDetailDrawerVisible: boolean;
  onUserRoleDetailClose: () => void;
  userRoleDetail: UserRoleDetail | null;
}

const UserRoleDetailComponent: React.FC<UserRoleDetailDrawerProps> = ({
                                                                     isUserRoleDetailDrawerVisible,
                                                                     onUserRoleDetailClose,
                                                                     userRoleDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onUserRoleDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onUserRoleDetailClose],
  );

  return (
    <Drawer
      title="用户和角色关联详情"
      open={isUserRoleDetailDrawerVisible}
      onClose={onUserRoleDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { userRoleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="角色ID">{ userRoleDetail.role_id}</Descriptions.Item>
          <Descriptions.Item label="创建者">{ userRoleDetail.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ userRoleDetail.create_time}</Descriptions.Item>
          <Descriptions.Item label="更新者">{ userRoleDetail.updater}</Descriptions.Item>
          <Descriptions.Item label="">{ userRoleDetail.deleted}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default UserRoleDetailComponent;
