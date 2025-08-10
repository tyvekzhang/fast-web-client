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
import dayjs from 'dayjs';
import {
  Descriptions,
  Drawer,
  Button,
  Space,
} from 'antd';
import { RoleDetail } from '@/types/role';
import React, { useMemo } from 'react';

interface RoleDetailDrawerProps {
  isRoleDetailDrawerVisible: boolean;
  onRoleDetailClose: () => void;
  roleDetail: RoleDetail | undefined;
  loading: boolean
}

const RoleDetailComponent: React.FC<RoleDetailDrawerProps> = ({
  isRoleDetailDrawerVisible,
  onRoleDetailClose,
  roleDetail,
  loading
}) => {
  const dictData = {
    "key1": "value1",
    "key2": "value2"
}

  return (
    <Drawer
      title="角色信息详情"
      open={isRoleDetailDrawerVisible}
      onClose={onRoleDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      { roleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="角色名称">
              { roleDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label="角色权限字符串">
              { roleDetail.code}
          </Descriptions.Item>
          <Descriptions.Item label="显示顺序">
              { roleDetail.sort}
          </Descriptions.Item>
          <Descriptions.Item label="操作类型">
              {(() => {
                const values = (roleDetail.operation_type || '').toString().split(',');
                return values.map((value, index) => {
                  const item = dictData["operation_type"] && dictData["operation_type"].find((d: Record<string, string>) => d.value === value);
                  const content = item ? <span key={value}>{item.label}</span> : <span key={value}>-</span>;
                  return index < values.length - 1 ? (
                    <React.Fragment key={index}>
                      {content}
                      ,&nbsp;
                    </React.Fragment>
                  ) : content;
                });
              })()}
          </Descriptions.Item>
          <Descriptions.Item label="数据范围">
              { roleDetail.data_scope}
          </Descriptions.Item>
          <Descriptions.Item label="数据范围">
              { roleDetail.data_scope_dept_ids}
          </Descriptions.Item>
          <Descriptions.Item label="角色状态">
              {(() => {
                const values = (roleDetail.status || '').toString().split(',');
                return values.map((value, index) => {
                  const item = dictData["role_status"] && dictData["role_status"].find((d: Record<string, string>) => d.value === value);
                  const content = item ? <span key={value}>{item.label}</span> : <span key={value}>-</span>;
                  return index < values.length - 1 ? (
                    <React.Fragment key={index}>
                      {content}
                      ,&nbsp;
                    </React.Fragment>
                  ) : content;
                });
              })()}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
              { roleDetail.comment}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
              {dayjs(roleDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default RoleDetailComponent;