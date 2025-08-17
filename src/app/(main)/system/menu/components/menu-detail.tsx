import SvgIcon from '@/components/assist/svg-icon';
import { getLabelByValue, useDictDataOptions } from '@/service/dict-datum';
import { MenuDetail } from '@/types/menu';
import { Descriptions, Drawer, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface MenuDetailDrawerProps {
  isMenuDetailDrawerVisible: boolean;
  onMenuDetailClose: () => void;
  menuDetail: MenuDetail | undefined;
  loading: boolean;
}

// 类型映射
const MENU_TYPE_MAP: Record<number, string> = {
  1: '目录',
  2: '菜单',
  3: '按钮',
};

// 状态映射
const STATUS_MAP: Record<number, string> = {
  0: '停用',
  1: '正常',
};

// 是否映射
const BOOLEAN_MAP: Record<number, string> = {
  0: '否',
  1: '是',
};

const MenuDetailComponent: React.FC<MenuDetailDrawerProps> = ({
  isMenuDetailDrawerVisible,
  onMenuDetailClose,
  menuDetail,
  loading,
}) => {
  const { dictData } = useDictDataOptions('yes_no'.split(','));
  // 渲染标签样式的内容
  const renderTag = (
    value: number,
    map: Record<number, string>,
    color?: string,
  ) => <Tag color={color}>{map[value] ?? '未知'}</Tag>;

  return (
    <Drawer
      title="系统菜单详情"
      open={isMenuDetailDrawerVisible}
      onClose={onMenuDetailClose}
      destroyOnHidden
      width={600}
      loading={loading}
      closable={true}
      maskClosable={true}
    >
      {menuDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="名称">{menuDetail.name}</Descriptions.Item>
          <Descriptions.Item label="图标">
            {menuDetail.icon ? (
              <>
                <SvgIcon name={menuDetail.icon}></SvgIcon>
              </>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="权限标识">
            {menuDetail.permission || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="排序">{menuDetail.sort}</Descriptions.Item>
          <Descriptions.Item label="路由地址">
            {menuDetail.path || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="组件路径">
            {menuDetail.component || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            {renderTag(menuDetail.type, MENU_TYPE_MAP, 'blue')}
          </Descriptions.Item>
          <Descriptions.Item label="是否缓存">
            {renderTag(menuDetail.cacheable, BOOLEAN_MAP, 'green')}
          </Descriptions.Item>
          <Descriptions.Item label="是否显示">
            {getLabelByValue(dictData, 'yes_no', '1')}
          </Descriptions.Item>
          <Descriptions.Item label="父目录">
            {menuDetail.parent_id || '根目录'}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {renderTag(
              menuDetail.status,
              STATUS_MAP,
              menuDetail.status === 1 ? 'green' : 'red',
            )}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {menuDetail?.create_time
              ? dayjs(menuDetail.create_time).format('YYYY-MM-DD HH:mm:ss')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {menuDetail?.update_time
              ? dayjs(menuDetail.update_time).format('YYYY-MM-DD HH:mm:ss')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注信息">
            {menuDetail.comment || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}
      {!menuDetail && !loading && (
        <div className="text-center py-8 text-gray-400">暂无数据</div>
      )}
    </Drawer>
  );
};

export default MenuDetailComponent;
