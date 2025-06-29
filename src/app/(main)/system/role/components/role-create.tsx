import { RoleCreate } from '@/types/role';
import { Button, Form, Input, Modal, Select, TreeSelect } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useEffect, useMemo, useState } from 'react';
import { MenuPage, MenuQuery } from '@/types/menu';
import { BaseQueryImpl } from '@/types';
import { fetchMenuByPage } from '@/service/menu';
import { TreeSelectUtil } from '@/utils/select-util';

const roleCreateFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

interface RoleCreateProps {
  isRoleCreateModalVisible: boolean;
  onRoleCreateCancel: () => void;
  onRoleCreateFinish: (roleCreate: RoleCreate) => void;
  isRoleCreateLoading: boolean;
  roleCreateForm: FormInstance;
}

const RoleCreateComponent: React.FC<RoleCreateProps> = ({
  isRoleCreateModalVisible,
  onRoleCreateCancel,
  onRoleCreateFinish,
  isRoleCreateLoading,
  roleCreateForm,
}) => {
  const [menuPageDataSource, setMenuPageDataSource] = useState<MenuPage[]>([]);
  const optionDataTransform = [{name: '菜单根目录', id: 0, children: menuPageDataSource}]
  const menuTreeData = TreeSelectUtil.transform(optionDataTransform as any);
  useEffect(() => {
    const fetchData = async () => {
      const pageData = BaseQueryImpl.create(1, 9999);
      const resp = await fetchMenuByPage(pageData);
      setMenuPageDataSource(resp.records);
    };
    fetchData().then(() => {
    });
  }, []);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onRoleCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isRoleCreateLoading} onClick={() => roleCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isRoleCreateLoading, roleCreateForm, onRoleCreateCancel],
  );

  return (
    <div>
      <Modal
        title="角色信息新增"
        open={isRoleCreateModalVisible}
        onCancel={onRoleCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...roleCreateFormItemLayout}
          form={ roleCreateForm}
          name="roleCreate"
          onFinish={onRoleCreateFinish}
          className="grid grid-cols-1 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="角色名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="code" label="角色权限字符串" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="sort" label="显示顺序" rules={[{ required: false, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="menu_ids" label="菜单权限" rules={[{ required: false, message: '请输入' }]}>
            <TreeSelect
              treeData={menuTreeData}
              treeCheckable
              placeholder="请选择菜单权限"
              allowClear
            />
          </Form.Item>
          <Form.Item name="status" label="角色状态" rules={[{ required: false, message: '请输入' }]}>
            <Select
              allowClear
              placeholder="请选择"
              optionFilterProp="label"
              defaultValue={"1"}
              onChange={() => {} }
              options={[
                {
                  value: '1',
                  label: '正常',
                },
                {
                  value: '0',
                  label: '停用',
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleCreateComponent;
