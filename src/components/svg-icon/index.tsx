import React, { memo, ReactElement } from 'react';
import * as AntdIcons from '@ant-design/icons';

interface SvgIconProps {
  name: string;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const defaultProps: Required<Pick<SvgIconProps, 'prefix' | 'size'>> = {
  prefix: 'icon',
  size: 'md',
};

const sizeClassMap: Record<NonNullable<SvgIconProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const SvgIcon: React.FC<SvgIconProps> = memo((props) => {
  const { name, prefix, size, className = '' } = { ...defaultProps, ...props };

  const symbolId = `#${prefix}-${name}`;
  const sizeClass = sizeClassMap[size];

  const AntdIcon = AntdIcons[name as keyof typeof AntdIcons] as any;

  if (!AntdIcon) {
    return (
      <svg
        className={`inline-block align-middle fill-current ${sizeClass} ${className}`}
      >
        <use href={symbolId} />
      </svg>
    );
  }

  return (
    <AntdIcon
      className={`inline-block align-middle ${sizeClass} ${className}`}
    />
  );
});

export function buildSvgIcon(
  name?: string,
  size?: SvgIconProps['size'],
  className?: string,
  prefix?: string,
): ReactElement | null {
  if (!name) return null;
  return <SvgIcon name={name} size={size} className={className}
                  prefix={prefix} />;
}

export default SvgIcon;
