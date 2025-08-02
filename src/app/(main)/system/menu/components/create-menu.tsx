import IconPicker from '@/components/assist/icon-picker';
import { CreateMenu } from '@/types/menu';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio, TreeSelect } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useEffect, useMemo } from 'react';

const createMenuFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 15 },
};

interface CreateMenuProps {
  isCreateMenuModalVisible: boolean;
  onCreateMenuCancel: () => void;
  onCreateMenuFinish: (CreateMenu: CreateMenu) => void;
  isCreateMenuLoading: boolean;
  createMenuForm: FormInstance;
  optionDataSource: any;
}

const CreateMenuComponent: React.FC<CreateMenuProps> = ({
  isCreateMenuModalVisible,
  onCreateMenuCancel,
  onCreateMenuFinish,
  isCreateMenuLoading,
  createMenuForm,
  optionDataSource,
}) => {
  const optionDataTransform = [
    { name: '根目录', id: 0, children: optionDataSource },
  ];
  const menuTreeData = TreeSelectUtil.convert(optionDataTransform);

  useEffect(() => {
    if (isCreateMenuModalVisible) {
      createMenuForm.resetFields();
    }
  }, [isCreateMenuModalVisible, createMenuForm]);

  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onCreateMenuCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isCreateMenuLoading}
        onClick={() => createMenuForm.submit()}
      >
        确定
      </Button>,
    ],
    [isCreateMenuLoading, createMenuForm, onCreateMenuCancel],
  );

  const handleIconChange = async (iconName: string) => {
    createMenuForm.setFieldsValue({ icon: iconName });
  };

  return (
    <Modal
      title="添加菜单"
      open={isCreateMenuModalVisible}
      onCancel={onCreateMenuCancel}
      footer={footerButtons}
      width={'60%'}
    >
      <Form
        {...createMenuFormItemLayout}
        form={createMenuForm}
        name="createMenu"
        onFinish={onCreateMenuFinish}
        layout="horizontal"
        initialValues={{
          parent_id: 0,
          type: '1',
          icon: '',
          sort: 1,
          is_external: 0,
          visible: 1,
          status: '1',
        }}
      >
        <Form.Item label="上级菜单" name="parent_id">
          <TreeSelect
            placeholder="请选择上级菜单"
            allowClear
            treeData={menuTreeData}
          />
        </Form.Item>

        <Form.Item label="菜单类型" name="type">
          <Radio.Group>
            <Radio value="1">目录</Radio>
            <Radio value="2">菜单</Radio>
            <Radio value="3">按钮</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="菜单图标" name="icon">
          <IconPicker onChange={handleIconChange} />
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="name"
          required
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        <Form.Item
          label="显示排序"
          name="sort"
          required
          rules={[{ required: true, message: '请输入显示排序' }]}
        >
          <Input placeholder="请输入显示排序" />
        </Form.Item>

        <Form.Item label="是否外链" name="is_external">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="路由地址"
          name="path"
          required
          rules={[
            { required: true, message: '请输入路由地址' },
            // 自定义校验
            ({ getFieldValue }) => ({
              validator(_, value) {
                const is_external = getFieldValue('is_external') === 1;
                if (is_external) {
                  if (!value || /^(http|https):\/\//.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('外链必须以 http:// 或 https:// 开头'),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
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

export default CreateMenuComponent;
