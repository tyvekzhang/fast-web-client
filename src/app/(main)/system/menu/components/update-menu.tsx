import IconPicker from '@/components/assist/icon-picker';
import { UpdateMenu } from '@/types/menu';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio, TreeSelect } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface UpdateMenuProps {
  isUpdateMenuModalVisible: boolean;
  onUpdateMenuCancel: () => void;
  onUpdateMenuFinish: () => void;
  isUpdateMenuLoading: boolean;
  updateMenuForm: FormInstance<UpdateMenu>;
  optionDataSource: any;
}

const updateMenuFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 15 },
};

const UpdateMenuComponent: React.FC<UpdateMenuProps> = ({
  isUpdateMenuModalVisible,
  onUpdateMenuCancel,
  onUpdateMenuFinish,
  isUpdateMenuLoading,
  updateMenuForm,
  optionDataSource,
}) => {
  const optionDataTransform = [
    { name: '根目录', id: 0, children: optionDataSource },
  ];
  const menuTreeData = TreeSelectUtil.convert(optionDataTransform);

  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateMenuCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateMenuLoading}
        onClick={() => updateMenuForm.submit()}
      >
        确定
      </Button>,
    ],
    [isUpdateMenuLoading, updateMenuForm, onUpdateMenuCancel],
  );

  console.log('updateMenuForm', updateMenuForm.getFieldsValue());

  // 处理图标选择
  const handleIconChange = async (iconName: string) => {
    updateMenuForm.setFieldsValue({ icon: iconName });
  };

  return (
    <Modal
      title="系统菜单编辑"
      open={isUpdateMenuModalVisible}
      onCancel={onUpdateMenuCancel}
      footer={footerButtons}
      destroyOnHidden
      width={'60%'}
    >
      <Form
        {...updateMenuFormItemLayout}
        form={updateMenuForm}
        name="updateMenu"
        onFinish={onUpdateMenuFinish}
        layout="horizontal"
      >
        <Form.Item label="上级菜单" name="parent_id">
          <TreeSelect
            placeholder="请选择上级菜单"
            allowClear
            treeData={menuTreeData}
          ></TreeSelect>
        </Form.Item>

        <Form.Item label="菜单类型" name="type">
          <Radio.Group>
            <Radio value={1}>目录</Radio>
            <Radio value={2}>菜单</Radio>
            <Radio value={3}>按钮</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="菜单图标" name="icon">
          <IconPicker onChange={handleIconChange} />
        </Form.Item>

        <Form.Item
          name="name"
          label="名称"
          required
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序"
          required
          rules={[{ required: true, message: '请输入显示排序' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          name="path"
          label="路由地址"
          required
          rules={[{ required: true, message: '请输入路由地址' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="是否显示" name="visible">
          <Radio.Group>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="permission"
          label="权限标识"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="comment"
          label="备注信息"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMenuComponent;
