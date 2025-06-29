import React, { useEffect, useState } from 'react';

interface TransitionWrapperProps {
  show: boolean;
  children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ show, children }) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  return shouldRender ? (
    <div
      style={{
        animation: `${show ? 'slideDown' : 'slideUp'} 0.3s linear`,
        overflow: 'hidden',
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null;
};

export default TransitionWrapper;
