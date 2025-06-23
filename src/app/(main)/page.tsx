'use client';

import { Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation("common")
  useEffect(() => {
    // probeService().then((res) => console.log(res));
  });
  return (
    <Button type="primary">Hello world</Button>
  )
};

export default Home;
