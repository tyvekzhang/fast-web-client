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
import { TableDetail } from '@/types/table';
import {
    Descriptions,
    Drawer
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface TableDetailDrawerProps {
  isTableDetailDrawerVisible: boolean;
  onTableDetailClose: () => void;
  tableDetail: TableDetail | null;
}

const TableDetailComponent: React.FC<TableDetailDrawerProps> = ({
  isTableDetailDrawerVisible,
  onTableDetailClose,
  tableDetail,
}) => {
  const dictData = {
    "key1": "value1",
    "key2": "value2"
}

  return (
    <Drawer
      title="[请填写功能名]详情"
      open={isTableDetailDrawerVisible}
      onClose={onTableDetailClose}
      destroyOnHidden
      width={600}
    >
      { tableDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="id">
              { tableDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="database_id">
              { tableDetail.database_id}
          </Descriptions.Item>
          <Descriptions.Item label="db_table_id">
              { tableDetail.db_table_id}
          </Descriptions.Item>
          <Descriptions.Item label="table_name">
              { tableDetail.table_name}
          </Descriptions.Item>
          <Descriptions.Item label="sub_table_name">
              { tableDetail.sub_table_name}
          </Descriptions.Item>
          <Descriptions.Item label="sub_table_fk_name">
              { tableDetail.sub_table_fk_name}
          </Descriptions.Item>
          <Descriptions.Item label="class_name">
              { tableDetail.class_name}
          </Descriptions.Item>
          <Descriptions.Item label="backend">
              { tableDetail.backend}
          </Descriptions.Item>
          <Descriptions.Item label="tpl_category">
              { tableDetail.tpl_category}
          </Descriptions.Item>
          <Descriptions.Item label="tpl_web_type">
              { tableDetail.tpl_web_type}
          </Descriptions.Item>
          <Descriptions.Item label="tpl_backend_type">
              { tableDetail.tpl_backend_type}
          </Descriptions.Item>
          <Descriptions.Item label="package_name">
              { tableDetail.package_name}
          </Descriptions.Item>
          <Descriptions.Item label="module_name">
              { tableDetail.module_name}
          </Descriptions.Item>
          <Descriptions.Item label="business_name">
              { tableDetail.business_name}
          </Descriptions.Item>
          <Descriptions.Item label="function_name">
              { tableDetail.function_name}
          </Descriptions.Item>
          <Descriptions.Item label="function_author">
              { tableDetail.function_author}
          </Descriptions.Item>
          <Descriptions.Item label="gen_type">
              { tableDetail.gen_type}
          </Descriptions.Item>
          <Descriptions.Item label="gen_path">
              { tableDetail.gen_path}
          </Descriptions.Item>
          <Descriptions.Item label="options">
              { tableDetail.options}
          </Descriptions.Item>
          <Descriptions.Item label="comment">
              { tableDetail.comment}
          </Descriptions.Item>
          <Descriptions.Item label="create_time">
              {dayjs(tableDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default TableDetailComponent;