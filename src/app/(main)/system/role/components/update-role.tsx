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
import { useRole } from '@/service/role';
import { createPaginationRequest } from '@/types';
import { ListMenusRequest } from '@/types/menu';
import type { UpdateRole } from '@/types/role';
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
import { useEffect, useMemo, useRef, useState } from 'react';

const updateRoleFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface UpdateRoleProps {
  isUpdateRoleModalVisible: boolean;
  onUpdateRoleCancel: () => void;
  onUpdateRoleFinish: (updateRole: UpdateRole) => void;
  isUpdateRoleLoading: boolean;
  updateRoleForm: FormInstance;
  roleId?: string;
}

const UpdateRoleComponent: React.FC<UpdateRoleProps> = ({
  isUpdateRoleModalVisible,
  onUpdateRoleCancel,
  onUpdateRoleFinish,
  isUpdateRoleLoading,
  updateRoleForm,
  roleId,
}) => {
  const { dictData } = useDictDataOptions(
    'operation_type,role_status'.split(','),
  );
  const { role, isLoading: isRoleLoading } = useRole(roleId || '');

  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  const [menuQueryParams, setMenuQueryParams] = useState<ListMenusRequest>();
  const isInternalChange = useRef(false);

  const { menus: menuListDataSource, isLoading: isMenuListLoading } = useMenus({
    ...menuQueryParams,
    ...createPaginationRequest(1, 1000),
  });

  const optionDataTransform = [
    { name: '根目录', id: 0, children: menuListDataSource },
  ];
  const menuTreeData = useMemo(
    () => TreeSelectUtil.convert(optionDataTransform as any),
    [menuListDataSource],
  );

  const getChildrenIds = (tree: any[], targetValue: number): number[] => {
    const findChildren = (nodes: any[], target: number): number[] => {
      for (const node of nodes) {
        if (node.value === target) {
          const children: number[] = [];
          const collect = (n: any) => {
            if (n.children) {
              n.children.forEach((child: any) => {
                children.push(child.value);
                collect(child);
              });
            }
          };
          collect(node);
          return children;
        }
        if (node.children) {
          const result = findChildren(node.children, target);
          if (result.length > 0) {
            return result;
          }
        }
      }
      return [];
    };
    return findChildren(tree, targetValue);
  };

  const getAllParentIds = (tree: any[], targetValue: number): number[] => {
    const findParents = (
      nodes: any[],
      target: number,
      parents: number[] = [],
    ): number[] | null => {
      for (const node of nodes) {
        const currentPath = [...parents, node.value];

        if (node.value === target) {
          return parents.filter((id) => id !== 0);
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

  useEffect(() => {
    if (role && isUpdateRoleModalVisible) {
      let initialMenuIds = role.menu_ids || [];

      // Filter out parent IDs if not all children are selected
      const filteredInitialMenuIds = initialMenuIds.filter((id) => {
        const childrenIds = getChildrenIds(menuTreeData, id);
        if (childrenIds.length > 0) {
          // It's a parent node
          return childrenIds.every((childId) =>
            initialMenuIds.includes(childId),
          );
        } else {
          // It's a leaf node
          return true;
        }
      });

      updateRoleForm.setFieldsValue({
        name: role.name,
        code: role.code,
        operation_type: role.operation_type,
        menu_ids: filteredInitialMenuIds,
        sort: role.sort,
        status: role.status?.toString(),
        comment: role.comment,
      });
      setSelectedMenuIds(filteredInitialMenuIds);
    }
  }, [role, isUpdateRoleModalVisible, updateRoleForm, menuTreeData]);

  const handleMenuChange = (values: number[]) => {
    if (isInternalChange.current) {
      return;
    }

    setSelectedMenuIds(values);

    let finalValues = [...values];
    finalValues = Array.from(new Set(finalValues)).sort((a, b) => a - b);

    isInternalChange.current = true;
    updateRoleForm.setFieldsValue({ menu_ids: finalValues });

    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  };

  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onUpdateRoleCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateRoleLoading || isRoleLoading}
        onClick={() => {
          const allMenuIds = [...selectedMenuIds];
          selectedMenuIds.forEach((menuId) => {
            const parentIds = getAllParentIds(menuTreeData, menuId);
            allMenuIds.push(...parentIds);
          });

          const finalMenuIds = Array.from(new Set(allMenuIds)).sort(
            (a, b) => a - b,
          );
          updateRoleForm.setFieldsValue({ menu_ids: finalMenuIds });
          updateRoleForm.submit();
        }}
      >
        确定
      </Button>,
    ],
    [
      isUpdateRoleLoading,
      isRoleLoading,
      updateRoleForm,
      onUpdateRoleCancel,
      selectedMenuIds,
      menuTreeData,
    ],
  );

  return (
    <Modal
      title="角色信息编辑"
      open={isUpdateRoleModalVisible}
      onCancel={onUpdateRoleCancel}
      footer={footerButtons}
      width={'50%'}
      destroyOnHidden
    >
      <Form
        {...updateRoleFormItemLayout}
        form={updateRoleForm}
        name="updateRole"
        onFinish={onUpdateRoleFinish}
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
            loading={isMenuListLoading}
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
  );
};

export default UpdateRoleComponent;
