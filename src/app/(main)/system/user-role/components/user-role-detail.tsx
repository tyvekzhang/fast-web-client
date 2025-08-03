// Copyright (c) 2025 FastWeb and/or its affiliates. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { UserRoleDetail } from '@/types/user-role';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface UserRoleDetailDrawerProps {
  isUserRoleDetailDrawerVisible: boolean;
  onUserRoleDetailClose: () => void;
  userRoleDetail: UserRoleDetail | undefined;
  loading: boolean;
}

const UserRoleDetailComponent: React.FC<UserRoleDetailDrawerProps> = ({
  isUserRoleDetailDrawerVisible,
  onUserRoleDetailClose,
  userRoleDetail,
  loading,
}) => {
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Drawer
      title="用户和角色关联详情"
      open={isUserRoleDetailDrawerVisible}
      onClose={onUserRoleDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      {userRoleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="自增编号">
            {userRoleDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="角色ID">
            {userRoleDetail.role_id}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(userRoleDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default UserRoleDetailComponent;
