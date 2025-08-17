'use client';

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
import type { ListMenusRequest } from '@/types/menu';
import type { CreateRole } from '@/types/role';
import { TreeSelectUtil } from '@/utils/select-util';
import {
  Button,
  Checkbox,
  type CheckboxOptionType,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  TreeSelect,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import type React from 'react';
import { useMemo, useRef, useState } from 'react';

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
  const { dictData } = useDictDataOptions(
    'operation_type,role_status'.split(','),
  );

  // 添加变量存放 menu_ids 的值
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateRoleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateRoleLoading}
        onClick={() => {
          // 点击完成时，加上父节点ID并去重
          const allMenuIds = [...selectedMenuIds];

          // 为每个选中的菜单ID添加其所有父节点ID
          selectedMenuIds.forEach((menuId) => {
            const parentIds = getAllParentIds(menuTreeData, menuId);
            allMenuIds.push(...parentIds);
          });

          // 去重并排序
          const finalMenuIds = Array.from(new Set(allMenuIds)).sort(
            (a, b) => a - b,
          );

          // 更新表单值
          createRoleForm.setFieldsValue({ menu_ids: finalMenuIds });

          // 提交表单
          createRoleForm.submit();
        }}
      >
        确定
      </Button>,
    ],
    [isCreateRoleLoading, createRoleForm, onCreateRoleCancel, selectedMenuIds],
  );

  const [menuQueryParams, setMenuQueryParams] = useState<ListMenusRequest>();
  const isInternalChange = useRef(false);

  const {
    menus: menuListDataSource,
    total,
    isLoading: isMenuListLoading,
    mutateMenus,
  } = useMenus({
    ...menuQueryParams,
    ...createPaginationRequest(1, 1000),
  });

  const optionDataTransform = [
    { name: '根目录', id: 0, children: menuListDataSource },
  ];
  const menuTreeData = TreeSelectUtil.convert(optionDataTransform as any);

  const getAllParentIds = (tree: any[], targetValue: number): number[] => {
    const findParents = (
      nodes: any[],
      target: number,
      parents: number[] = [],
    ): number[] | null => {
      for (const node of nodes) {
        const currentPath = [...parents, node.value];

        if (node.value === target) {
          return parents.filter((id) => id !== 0); // 排除根节点
        }

        if (node.children && node.children.length > 0) {
          const result = findParents(node.children, target, currentPath);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    };

    return findParents(tree, targetValue) || [];
  };

  const handleMenuChange = (values: number[]) => {
    // 防止内部更新触发onChange
    if (isInternalChange.current) {
      return;
    }

    // 更新选中的菜单ID状态
    setSelectedMenuIds(values);

    let finalValues = [...values];

    // 去重并排序
    finalValues = Array.from(new Set(finalValues)).sort((a, b) => a - b);

    // 设置标志防止循环
    isInternalChange.current = true;
    createRoleForm.setFieldsValue({ menu_ids: finalValues });

    // 重置标志
    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
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
            status: '1',
            sort: 1,
            operation_type: '1, 2',
          }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="权限标识"
            rules={[{ required: true, message: '请输入权限标识' }]}
          >
            <Input placeholder="请输入权限标识" />
          </Form.Item>
          <Form.Item
            name="operation_type"
            label="操作类型"
            rules={[{ required: true, message: '请输入操作类型' }]}
          >
            <Checkbox.Group
              options={dictData['operation_type'] as CheckboxOptionType[]}
              className="flex flex-row gap-4"
            />
          </Form.Item>
          <Form.Item
            name="menu_ids"
            label="菜单权限"
            rules={[{ required: true, message: '请选择菜单权限' }]}
          >
            <TreeSelect
              treeData={menuTreeData}
              treeCheckable
              placeholder="请选择菜单权限"
              allowClear
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              onChange={handleMenuChange}
            />
          </Form.Item>
          <Form.Item
            name="sort"
            label="显示顺序"
            rules={[{ required: false, message: '请输入显示顺序' }]}
          >
            <InputNumber className="w-1/3" placeholder="请输入显示顺序" />
          </Form.Item>
          <Form.Item
            name="status"
            label="角色状态"
            rules={[{ required: false, message: '请输入角色状态' }]}
          >
            <Radio.Group
              options={dictData['role_status'] as CheckboxOptionType[]}
            />
          </Form.Item>
          <Form.Item
            name="comment"
            label="备注"
            rules={[{ required: false, message: '请输入备注' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRoleComponent;
