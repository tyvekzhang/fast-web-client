import { MenuDetail } from '@/types/menu';
import { Descriptions, Drawer } from 'antd';
import React from 'react';

interface MenuDetailDrawerProps {
  isMenuDetailDrawerVisible: boolean;
  onMenuDetailClose: () => void;
  menuDetail: MenuDetail | undefined;
  loading: boolean;
}

const MenuDetailComponent: React.FC<MenuDetailDrawerProps> = ({
  isMenuDetailDrawerVisible,
  onMenuDetailClose,
  menuDetail,
  loading,
}) => {
  return (
    <Drawer
      title="系统菜单详情"
      open={isMenuDetailDrawerVisible}
      onClose={onMenuDetailClose}
      destroyOnHidden
      width={600}
      loading={loading}
    >
      {menuDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="名称">{menuDetail.name}</Descriptions.Item>
          <Descriptions.Item label="图标">{menuDetail.icon}</Descriptions.Item>
          <Descriptions.Item label="权限标识">
            {menuDetail.permission}
          </Descriptions.Item>
          <Descriptions.Item label="排序">{menuDetail.sort}</Descriptions.Item>
          <Descriptions.Item label="路由地址">
            {menuDetail.path}
          </Descriptions.Item>
          <Descriptions.Item label="组件路径">
            {menuDetail.component}
          </Descriptions.Item>
          <Descriptions.Item label="类型">{menuDetail.type}</Descriptions.Item>
          <Descriptions.Item label="是否缓存">
            {menuDetail.cacheable}
          </Descriptions.Item>
          <Descriptions.Item label="是否显示">
            {menuDetail.visible}
          </Descriptions.Item>
          <Descriptions.Item label="父ID">
            {menuDetail.parent_id}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {menuDetail.status}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {menuDetail.create_time}
          </Descriptions.Item>
          <Descriptions.Item label="备注信息">
            {menuDetail.comment}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default MenuDetailComponent;
