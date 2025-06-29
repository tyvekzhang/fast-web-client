import React, { ReactNode } from 'react';

interface SpaceProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  wrap?: boolean;
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

const Space: React.FC<SpaceProps> = ({
  children,
  direction = 'horizontal',
  size = 'small',
  wrap = false,
  align = 'center',
  justify = 'start',
  className = '',
}) => {
  const getSpaceClasses = () => {
    const baseClasses = ['flex'];

    if (direction === 'vertical') {
      baseClasses.push('flex-col');
    }

    if (wrap) {
      baseClasses.push('flex-wrap');
    }

    switch (align) {
      case 'start':
        baseClasses.push('items-start');
        break;
      case 'center':
        baseClasses.push('items-center');
        break;
      case 'end':
        baseClasses.push('items-end');
        break;
      case 'baseline':
        baseClasses.push('items-baseline');
        break;
    }

    switch (justify) {
      case 'start':
        baseClasses.push('justify-start');
        break;
      case 'center':
        baseClasses.push('justify-center');
        break;
      case 'end':
        baseClasses.push('justify-end');
        break;
      case 'between':
        baseClasses.push('justify-between');
        break;
      case 'around':
        baseClasses.push('justify-around');
        break;
      case 'evenly':
        baseClasses.push('justify-evenly');
        break;
    }

    return [...baseClasses, className].join(' ');
  };

  const getItemClasses = () => {
    const itemClasses = [];

    switch (size) {
      case 'small':
        itemClasses.push(direction === 'horizontal' ? 'mr-2' : 'mb-2');
        break;
      case 'medium':
        itemClasses.push(direction === 'horizontal' ? 'mr-4' : 'mb-4');
        break;
      case 'large':
        itemClasses.push(direction === 'horizontal' ? 'mr-8' : 'mb-8');
        break;
    }

    return itemClasses.join(' ');
  };

  return (
    <div className={getSpaceClasses()}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={getItemClasses()}>
          {child}
        </div>
      ))}
    </div>
  );
};

export { Space };
