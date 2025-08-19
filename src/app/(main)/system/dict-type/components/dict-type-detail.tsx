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
import { DictTypeDetail } from '@/types/dict-type';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface DictTypeDetailDrawerProps {
  isDictTypeDetailDrawerVisible: boolean;
  onDictTypeDetailClose: () => void;
  dictTypeDetail: DictTypeDetail | undefined;
  loading: boolean;
}

const DictTypeDetailComponent: React.FC<DictTypeDetailDrawerProps> = ({
  isDictTypeDetailDrawerVisible,
  onDictTypeDetailClose,
  dictTypeDetail,
  loading,
}) => {
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Drawer
      title="字典类型详情"
      open={isDictTypeDetailDrawerVisible}
      onClose={onDictTypeDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      {dictTypeDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="主键">
            {dictTypeDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="字典名称">
            {dictTypeDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label="字典类型">
            {dictTypeDetail.type}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {dictTypeDetail.comment}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(dictTypeDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default DictTypeDetailComponent;
