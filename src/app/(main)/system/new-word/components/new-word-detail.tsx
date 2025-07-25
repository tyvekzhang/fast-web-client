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
import { NewWordDetail } from '@/types/new-word';
import { Descriptions, Drawer } from 'antd';
import React from 'react';

interface NewWordDetailDrawerProps {
  isNewWordDetailDrawerVisible: boolean;
  onNewWordDetailClose: () => void;
  newWordDetail: NewWordDetail | null;
}

const NewWordDetailComponent: React.FC<NewWordDetailDrawerProps> = ({
  isNewWordDetailDrawerVisible,
  onNewWordDetailClose,
  newWordDetail,
}) => {
  const dictData = {
    key1: 'value1',
    key2: 'value2',
  };

  return (
    <Drawer
      title="[请填写功能名]详情"
      open={isNewWordDetailDrawerVisible}
      onClose={onNewWordDetailClose}
      destroyOnHidden
      width={600}
    >
      {newWordDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="id">{newWordDetail.id}</Descriptions.Item>
          <Descriptions.Item label="word">
            {newWordDetail.word}
          </Descriptions.Item>
          <Descriptions.Item label="translation">
            {newWordDetail.translation}
          </Descriptions.Item>
          <Descriptions.Item label="next_review_date">
            {newWordDetail.next_review_date}
          </Descriptions.Item>
          <Descriptions.Item label="tenant">
            {newWordDetail.tenant}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default NewWordDetailComponent;
