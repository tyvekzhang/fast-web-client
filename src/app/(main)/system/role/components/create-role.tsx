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
import { useMenus } from '@/service/menu';
import { createPaginationRequest } from '@/types';
import { ListMenusRequest } from '@/types/menu';
import { CreateRole } from '@/types/role';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, CheckboxOptionType, Form, Input, InputNumber, Modal, Radio, Select, TreeSelect } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo, useState } from 'react';

const createRoleFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface CreateRoleProps {
  isCreateRoleModalVisible: boolean;
  onCreateRoleCancel: () => void;
  onCreateRoleFinish: (createRole: CreateRole) => void;
  isCreateRoleLoading: boolean;
  createRoleForm: FormInstance;
}

const CreateRoleComponent: React.FC<CreateRoleProps> = ({
  isCreateRoleModalVisible,
  onCreateRoleCancel,
  onCreateRoleFinish,
  isCreateRoleLoading,
  createRoleForm,
}) => {

  const { dictData } = useDictDataOptions("operation_type,role_status".split(","))
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateRoleCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isCreateRoleLoading} onClick={() => createRoleForm.submit()}>
        确定
      </Button>,
    ],
    [isCreateRoleLoading, createRoleForm, onCreateRoleCancel],
  );

  const [menuQueryParams, setMenuQueryParams] = useState<ListMenusRequest>();

  const {
    menus: menuListDataSource,
    total,
    isLoading: isMenuListLoading,
    mutateMenus,
  } = useMenus({
    ...menuQueryParams,
    ...createPaginationRequest(1, 1000),
  });

  const optionDataTransform = [{ name: '根目录', id: 0, children: menuListDataSource }]
  const menuTreeData = TreeSelectUtil.convert(optionDataTransform as any);
  const getParentIds = (tree: any[], value: number, parents: number[] = []): number[] => {
    for (const node of tree) {
      if (node.value === value) {
        return parents.filter((id) => id !== 0); 
      }
      if (node.children) {
        const found = getParentIds(node.children, value, [...parents, node.value]);
        if (found.length) {
          return found.filter((id) => id !== 0); 
        }
      }
    }
    return [];
  };

  return (
    <div>
      <Modal
        title="角色信息新增"
        open={isCreateRoleModalVisible}
        onCancel={onCreateRoleCancel}
        footer={footerButtons}
        width={'50%'}
      >
        <Form
          {...createRoleFormItemLayout}
          form={createRoleForm}
          name="createRole"
          onFinish={onCreateRoleFinish}
          initialValues={{
            status: "1",
            sort: 1
          }}
        >
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="权限标识" rules={[{ required: true, message: '请输入权限标识' }]}>
            <Input placeholder="请输入权限标识" />
          </Form.Item>
          <Form.Item name="operation_type" label="操作类型" rules={[{ required: true, message: '请输入操作类型' }]}>
            <Select
              mode="multiple"
              placeholder="请选择操作类型"
              options={dictData["operation_type"]}
            />
          </Form.Item>
          <Form.Item name="menu_ids" label="菜单权限" rules={[{ required: true, message: '请输入' }]}>
            <TreeSelect
              treeData={menuTreeData}
              treeCheckable
              placeholder="请选择菜单权限"
              allowClear
              onChange={(values) => {
                let allValues = [...values];
                values.forEach((val: number) => {
                  const parentIds = getParentIds(menuTreeData, val);
                  allValues.push(...parentIds);
                });
                allValues = Array.from(new Set(allValues));
                createRoleForm.setFieldsValue({ menu_ids: allValues });
              }}
            />
          </Form.Item>
          <Form.Item name="sort" label="显示顺序" rules={[{ required: false, message: '请输入显示顺序' }]}>
            <InputNumber className='w-2/3' placeholder="请输入显示顺序" />
          </Form.Item>
          <Form.Item name="status" label="角色状态" rules={[{ required: false, message: '请输入角色状态' }]}>
            <Radio.Group options={dictData["role_status"] as CheckboxOptionType[]} />
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入备注' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRoleComponent;