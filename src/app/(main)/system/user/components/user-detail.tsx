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

import { useDictDataOptions } from '@/service/dict-datum';
import { UserDetail } from '@/types/user';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface UserDetailDrawerProps {
  isUserDetailDrawerVisible: boolean;
  onUserDetailClose: () => void;
  userDetail: UserDetail | undefined;
  loading: boolean;
}

const UserDetailComponent: React.FC<UserDetailDrawerProps> = ({
  isUserDetailDrawerVisible,
  onUserDetailClose,
  userDetail,
  loading,
}) => {
  const { dictData } = useDictDataOptions('user_status'.split(','));
  return (
    <Drawer
      title="用户信息详情"
      open={isUserDetailDrawerVisible}
      onClose={onUserDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      {userDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="用户名">
            {userDetail.username}
          </Descriptions.Item>
          <Descriptions.Item label="昵称">
            {userDetail.nickname}
          </Descriptions.Item>
          <Descriptions.Item label="头像地址">
            {userDetail.avatar_url}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {(() => {
              const values = (userDetail.status || '').toString().split(',');
              return values.map((value, index) => {
                const item =
                  dictData['user_status'] &&
                  dictData['user_status'].find(
                    (d: Record<string, string>) => d.value === value,
                  );
                const content = item ? (
                  <span key={value}>{item.label}</span>
                ) : (
                  <span key={value}>-</span>
                );
                return index < values.length - 1 ? (
                  <React.Fragment key={index}>
                    {content}
                    ,&nbsp;
                  </React.Fragment>
                ) : (
                  content
                );
              });
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {userDetail.remark}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(userDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default UserDetailComponent;
