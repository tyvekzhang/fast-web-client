import { MenuBatchModify } from '@/types/menu';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface MenuBatchModifyProps {
  isMenuBatchModifyModalVisible: boolean;
  onMenuBatchModifyCancel: () => void;
  onMenuBatchModifyFinish: () => void;
  isMenuBatchModifyLoading: boolean;
  menuBatchModifyForm: FormInstance<MenuBatchModify>;
}

const menuBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MenuBatchModifyComponent: React.FC<MenuBatchModifyProps> = ({
  isMenuBatchModifyModalVisible,
  onMenuBatchModifyCancel,
  onMenuBatchModifyFinish,
  isMenuBatchModifyLoading,
  menuBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onMenuBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isMenuBatchModifyLoading} onClick={onMenuBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isMenuBatchModifyLoading, onMenuBatchModifyCancel],
  );

  return (
    <Modal
      title="系统菜单编辑"
      open={isMenuBatchModifyModalVisible}
      onCancel={onMenuBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... menuBatchModifyFormItemLayout}
          form={ menuBatchModifyForm}
          name="menuBatchModify"
          onFinish={onMenuBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="icon" label="图标" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="permission" label="权限标识" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="path" label="路由地址" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="component" label="组件路径" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="cacheable" label="是否缓存" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="visible" label="是否显示" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="parent_id" label="父ID" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: false, message: '请输入' }]}>
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
          <Form.Item name="comment" label="备注信息" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default MenuBatchModifyComponent;