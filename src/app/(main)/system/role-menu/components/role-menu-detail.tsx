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
import { RoleMenuDetail } from '@/types/role-menu';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface RoleMenuDetailDrawerProps {
  isRoleMenuDetailDrawerVisible: boolean;
  onRoleMenuDetailClose: () => void;
  roleMenuDetail: RoleMenuDetail | undefined;
  loading: boolean;
}

const RoleMenuDetailComponent: React.FC<RoleMenuDetailDrawerProps> = ({
  isRoleMenuDetailDrawerVisible,
  onRoleMenuDetailClose,
  roleMenuDetail,
  loading,
}) => {
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Drawer
      title="角色和菜单关联详情"
      open={isRoleMenuDetailDrawerVisible}
      onClose={onRoleMenuDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      {roleMenuDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="自增编号">
            {roleMenuDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="角色ID">
            {roleMenuDetail.role_id}
          </Descriptions.Item>
          <Descriptions.Item label="菜单ID">
            {roleMenuDetail.menu_id}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(roleMenuDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default RoleMenuDetailComponent;
