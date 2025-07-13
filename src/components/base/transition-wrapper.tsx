import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface TransitionWrapperProps {
  show: boolean;
  children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  show,
  children,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{
            opacity: 0,
            scaleY: 0,
            transition: { type: 'tween', duration: 0.4 },
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 200,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionWrapper;
