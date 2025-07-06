import { message } from '@/components/global-toast';
import React, { FC, useEffect } from 'react';
import useStyles from './style';

interface UndoCompProps {
  duration?: number;
  onUndo?: () => void;
  msg?: string;
  onHide: () => void; // 新增一个回调函数来通知父组件隐藏
}

const UndoComp: FC<UndoCompProps> = ({
  duration = 5,
  onUndo,
  msg = '删除成功',
  onHide,
}) => {
  const { styles } = useStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      onHide();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onHide]);

  const handleUndo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onUndo) {
      onUndo();
    }
    message.success('恢复成功');
    onHide();
  };

  return (
    <div className={styles.container}>
      <span>{msg}，[</span>
      <a href="#" onClick={handleUndo}>
        撤销
      </a>
      <span>]</span>
    </div>
  );
};

export default UndoComp;
