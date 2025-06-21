'use client';

import { probeService } from '@/service/probe-service';
import { Button } from 'antd';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    probeService().then((res) => console.log(res));
  });
  return <Button type="primary">Button</Button>;
};

export default Home;
