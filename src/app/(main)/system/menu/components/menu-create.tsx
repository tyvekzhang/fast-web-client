import { MenuCreate } from '@/types/menu';
import { Button, Form, Input, Modal, Radio, TreeSelect } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';
import IconSelect from './IconSelect';
import { TreeSelectUtil } from '@/utils/select-util';

const menuCreateFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 15 },
};

interface MenuCreateProps {
  isMenuCreateModalVisible: boolean;
  onMenuCreateCancel: () => void;
  onMenuCreateFinish: (MenuCreate: MenuCreate) => void;
  isMenuCreateLoading: boolean;
  menuCreateForm: FormInstance;
  optionDataSource: any;
}

const MenuCreateComponent: React.FC<MenuCreateProps> = ({
                                                          isMenuCreateModalVisible,
                                                          onMenuCreateCancel,
                                                          onMenuCreateFinish,
                                                          isMenuCreateLoading,
                                                          menuCreateForm,
                                                          optionDataSource,
                                                        }) => {
  const optionDataTransform = [{ name: '根目录', id: 0, children: optionDataSource }];
  const menuTreeData = TreeSelectUtil.transform(optionDataTransform);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onMenuCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isMenuCreateLoading} onClick={() => menuCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isMenuCreateLoading, menuCreateForm, onMenuCreateCancel],
  );
  const handleIconChange = async (iconName: string) => {
    menuCreateForm.setFieldsValue({ icon: iconName });
  };

  return (
    <Modal
      title="添加菜单"
      open={isMenuCreateModalVisible}
      onCancel={onMenuCreateCancel}
      footer={footerButtons}
      width={'60%'}
    >
      <Form
        {...menuCreateFormItemLayout}
        form={menuCreateForm}
        name="menuCreate"
        onFinish={onMenuCreateFinish}
        layout="horizontal"
      >
        <Form.Item label="上级菜单" name="parent_id">
          <TreeSelect
            placeholder="请选择上级菜单"
            allowClear
            treeData={menuTreeData}
          >
          </TreeSelect>
        </Form.Item>

        <Form.Item label="菜单类型" name="type">
          <Radio.Group>
            <Radio value="1">目录</Radio>
            <Radio value="2">菜单</Radio>
            <Radio value="3">按钮</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="菜单图标" name="icon">
          <IconSelect onChange={handleIconChange} />
        </Form.Item>

        <Form.Item label="菜单名称" name="name" required rules={[{ required: true, message: '请输入菜单名称' }]}>
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        <Form.Item label="显示排序" name="sort" required rules={[{ required: true, message: '请输入显示排序' }]}>
          <Input placeholder="请输入显示排序" />
        </Form.Item>

        <Form.Item label="是否外链" name="isExternal">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="路由地址" name="path" required rules={[{ required: true, message: '请输入路由地址' }]}>
          <Input placeholder="请输入路由地址" />
        </Form.Item>

        <Form.Item label="显示状态" name="visible">
          <Radio.Group>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="菜单状态" name="status">
          <Radio.Group>
            <Radio value="1">正常</Radio>
            <Radio value="0">停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuCreateComponent;

