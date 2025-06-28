'use client';

import { App, Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('common');
  const { message } = App.useApp(); // 获取 message 实例

  const showToast = () => {
    message.success('Hello user!'); // 使用 success 方法
  };

  useEffect(() => {
    // probeService().then((res) => console.log(res));
  });

  return (
    <div className="h-full flex items-center justify-center">
      <Button onClick={showToast}>
        Hello user
      </Button>
    </div>
  );
};

export default Home;
