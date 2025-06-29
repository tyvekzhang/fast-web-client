import React, { memo } from 'react';
import useStyles from './style';
import * as AntdIcons from '@ant-design/icons';

interface SvgIconProp {
  name: string;
  prefix?: string;
  size?: number;
  style?: React.CSSProperties;
}

const defaultProps: Required<Pick<SvgIconProp, 'prefix' | 'size'>> = {
  prefix: 'icon',
  size: 16,
};

const getIconStyle = (size: number, style?: React.CSSProperties) => ({
  width: `${size}px`,
  height: `${size}px`,
  ...style,
});

const SvgIcon: React.FC<SvgIconProp> = memo((props) => {
  const { name, prefix, size, style } = { ...defaultProps, ...props };
  const { styles } = useStyles();

  const symbolId = `#${prefix}-${name}`;
  const iconStyle = getIconStyle(size, style);

  // 动态获取 Ant Design 图标组件
  const AntdIcon = AntdIcons[name as keyof typeof AntdIcons] as any;

  // 如果图标不存在，返回一个默认的占位符
  if (!AntdIcon) {
    return (
      <svg className={styles.svgIcon} style={iconStyle}>
        <use href={symbolId} />
      </svg>
    )
  }

  // 渲染 Ant Design 图标
  return <AntdIcon style={iconStyle} className={styles.svgIcon}/>;

});

export default SvgIcon;
