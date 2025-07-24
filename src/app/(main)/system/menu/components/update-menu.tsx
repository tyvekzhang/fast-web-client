import IconPicker from '@/components/base/icon-picker';
import { UpdateMenu } from '@/types/menu';
import { TreeSelectUtil } from '@/utils/select-util';
import { Button, Form, Input, Modal, Radio, Select, TreeSelect } from 'antd';
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
  const menuTreeData = TreeSelectUtil.transform(optionDataTransform);

  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onUpdateMenuCancel}>
        取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={isUpdateMenuLoading}
        onClick={() => updateMenuForm.submit()} // 调整为表单提交方式
      >
        确定
      </Button>,
    ],
    [isUpdateMenuLoading, updateMenuForm, onUpdateMenuCancel], // 依赖项添加表单实例
  );

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
      width={'60%'} // 调整宽度与创建菜单一致
    >
      <Form
        {...updateMenuFormItemLayout}
        form={updateMenuForm}
        name="updateMenu"
        onFinish={onUpdateMenuFinish}
        layout="horizontal" // 调整布局为水平
      >
        {/* 上级菜单 - 改为树形选择 */}
        <Form.Item label="上级菜单" name="parent_id">
          <TreeSelect
            placeholder="请选择上级菜单"
            allowClear
            treeData={menuTreeData}
          ></TreeSelect>
        </Form.Item>

        {/* 菜单类型 - 改为单选按钮组 */}
        <Form.Item label="菜单类型" name="type">
          <Radio.Group>
            <Radio value="1">目录</Radio>
            <Radio value="2">菜单</Radio>
            <Radio value="3">按钮</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 菜单图标 - 改为图标选择器 */}
        <Form.Item label="菜单图标" name="icon">
          <IconPicker onChange={handleIconChange} />
        </Form.Item>

        {/* 名称 - 增加必填验证 */}
        <Form.Item
          name="name"
          label="名称"
          required
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 排序 - 增加必填验证 */}
        <Form.Item
          name="sort"
          label="排序"
          required
          rules={[{ required: true, message: '请输入显示排序' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 增加是否外链选项 */}
        <Form.Item label="是否外链" name="isExternal">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 路由地址 - 增加必填验证 */}
        <Form.Item
          name="path"
          label="路由地址"
          required
          rules={[{ required: true, message: '请输入路由地址' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 组件路径 */}
        <Form.Item
          name="component"
          label="组件路径"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 是否显示 - 改为单选按钮组 */}
        <Form.Item label="是否显示" name="visible">
          <Radio.Group>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 权限标识 */}
        <Form.Item
          name="permission"
          label="权限标识"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 是否缓存 - 改为单选按钮组 */}
        <Form.Item label="是否缓存" name="cacheable">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 状态 - 保持下拉选择（与创建菜单一致） */}
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]} // 增加必填验证
        >
          <Select
            allowClear
            placeholder="请选择"
            optionFilterProp="label"
            defaultValue={'1'}
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

        {/* 备注信息 */}
        <Form.Item
          name="comment"
          label="备注信息"
          rules={[{ required: false, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMenuComponent;
