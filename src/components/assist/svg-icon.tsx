import { cn } from '@/lib/utils'; // Assuming cn is imported from here
import { Tooltip } from 'antd';
import * as LucideIcons from 'lucide-react';
import type React from 'react';
import { memo, type ReactElement } from 'react';

interface SvgIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  strokeWidth?: number;
  enableHover?: boolean;
}

const defaultProps: Required<
  Pick<SvgIconProps, 'size' | 'strokeWidth' | 'enableHover'>
> = {
  size: 'md',
  strokeWidth: 1.6,
  enableHover: true,
};

const sizeClassMap: Record<NonNullable<SvgIconProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const SvgIcon: React.FC<SvgIconProps> = memo((props) => {
  const { name, size, className, strokeWidth, enableHover } = {
    ...defaultProps,
    ...props,
  };

  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as any;

  if (!LucideIcon) {
    const QuestionMarkIcon = LucideIcons.HelpCircle;
    return (
      <QuestionMarkIcon
        className={cn(
          'inline-block align-middle text-inherit',
          sizeClassMap[size],
          enableHover &&
            'transition-all duration-200 ease-in-out hover:opacity-75 hover:scale-105 cursor-pointer',
          className,
        )}
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <Tooltip title={name}>
      <LucideIcon
        className={cn(
          'inline-block align-middle text-inherit',
          sizeClassMap[size],
          enableHover &&
            'transition-all duration-200 ease-in-out hover:opacity-75 hover:scale-105',
          className,
        )}
        strokeWidth={strokeWidth}
      />
    </Tooltip>
  );
});

SvgIcon.displayName = 'SvgIcon';

export function buildSvgIcon(
  name?: string,
  size?: SvgIconProps['size'],
  className?: string,
  strokeWidth?: number,
  enableHover?: boolean,
): ReactElement | null {
  if (!name) return null;

  return (
    <SvgIcon
      name={name}
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      enableHover={enableHover}
    />
  );
}

export default SvgIcon;
