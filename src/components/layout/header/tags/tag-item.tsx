import type { MenuProps } from 'antd';
import { Dropdown, Tag } from 'antd';
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  RefreshCw,
  Square,
  X,
} from 'lucide-react';
import { type FC, useMemo, useState } from 'react';

interface TagItemProps {
  name: string;
  fixed?: boolean;
  active?: boolean;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  closeTag: () => void;
  onClick: () => void;
  onCloseOthers?: () => void;
  onCloseLeft?: () => void;
  onCloseRight?: () => void;
  onCloseAll?: () => void;
  onRefresh?: () => void;
}

const handleMenuItemClick =
  (callback?: () => void) =>
  (e: { domEvent: { stopPropagation: () => void } }) => {
    e.domEvent.stopPropagation();
    callback?.();
  };

const TagItem: FC<TagItemProps> = ({
  name,
  fixed = false,
  active = false,
  isFirst,
  isLast,
  closeTag,
  onClick,
  onCloseOthers,
  onCloseLeft,
  onCloseRight,
  onCloseAll,
  onRefresh,
}) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const items: MenuProps['items'] = useMemo(() => {
    const baseItems: MenuProps['items'] = [
      {
        key: 'refresh',
        label: '刷新页面',
        icon: <RefreshCw size={14} />,
        onClick: handleMenuItemClick(onRefresh),
      },
      {
        key: 'closeCurrent',
        label: '关闭当前',
        icon: <X size={14} />,
        onClick: handleMenuItemClick(closeTag),
        disabled: fixed,
      },
      {
        key: 'closeOthers',
        label: '关闭其他',
        icon: <Square size={14} />,
        onClick: handleMenuItemClick(onCloseOthers),
      },
    ];

    if (!isFirst) {
      baseItems.push({
        key: 'closeLeft',
        label: '关闭左侧',
        icon: <ChevronLeft size={14} />,
        onClick: handleMenuItemClick(onCloseLeft),
      });
    }

    if (!isLast) {
      baseItems.push({
        key: 'closeRight',
        label: '关闭右侧',
        icon: <ChevronRight size={14} />,
        onClick: handleMenuItemClick(onCloseRight),
      });
    }

    baseItems.push({
      key: 'closeAll',
      label: '全部关闭',
      icon: <CircleX size={14} />,
      onClick: handleMenuItemClick(onCloseAll),
    });

    return baseItems;
  }, [
    isFirst,
    isLast,
    fixed,
    closeTag,
    onCloseOthers,
    onCloseLeft,
    onCloseRight,
    onCloseAll,
    onRefresh,
  ]);

  return (
    <Dropdown
      menu={{ items }}
      trigger={['contextMenu']}
      open={contextMenuOpen}
      onOpenChange={setContextMenuOpen}
    >
      <Tag
        closable={!fixed}
        onClose={(e) => {
          e.preventDefault();
          closeTag();
        }}
        closeIcon
        onClick={onClick}
        className={`mr-1 h-full flex justify-center items-center cursor-pointer transition-colors duration-200 ${
          active
            ? 'bg-primary/90 text-white/90 hover:opacity-90'
            : 'bg-gray-100 text-gray-700 hover:opacity-90'
        }`}
      >
        <span className="max-w-16 truncate">{name}</span>
      </Tag>
    </Dropdown>
  );
};

export default TagItem;
