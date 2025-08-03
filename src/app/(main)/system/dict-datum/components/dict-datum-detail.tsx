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
import { DictDatumDetail } from '@/types/dict-datum';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface DictDatumDetailDrawerProps {
  isDictDatumDetailDrawerVisible: boolean;
  onDictDatumDetailClose: () => void;
  dictDatumDetail: DictDatumDetail | undefined;
  loading: boolean;
}

const DictDatumDetailComponent: React.FC<DictDatumDetailDrawerProps> = ({
  isDictDatumDetailDrawerVisible,
  onDictDatumDetailClose,
  dictDatumDetail,
  loading,
}) => {
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Drawer
      title="字典数据详情"
      open={isDictDatumDetailDrawerVisible}
      onClose={onDictDatumDetailClose}
      destroyOnHidden
      loading={loading}
      width={600}
    >
      {dictDatumDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="主键">
            {dictDatumDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="字典排序">
            {dictDatumDetail.sort}
          </Descriptions.Item>
          <Descriptions.Item label="字典标签">
            {dictDatumDetail.label}
          </Descriptions.Item>
          <Descriptions.Item label="字典键值">
            {dictDatumDetail.value}
          </Descriptions.Item>
          <Descriptions.Item label="字典类型">
            {dictDatumDetail.type}
          </Descriptions.Item>
          <Descriptions.Item label="回显样式">
            {dictDatumDetail.echo_style}
          </Descriptions.Item>
          <Descriptions.Item label="扩展样式">
            {dictDatumDetail.ext_class}
          </Descriptions.Item>
          <Descriptions.Item label="是否默认">
            {dictDatumDetail.is_default}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {dictDatumDetail.status}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {dictDatumDetail.comment}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(dictDatumDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default DictDatumDetailComponent;
