'use client';

import { probeService } from '@/service/probe-service';
import { Button } from 'antd';
import { useEffect } from 'react';
import { LanguageToggle } from '@/components/language-toggle';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation("common")
  useEffect(() => {
    probeService().then((res) => console.log(res));
  });
  return <div>
    <Button className="rounded-full h-12">Button</Button>
    <LanguageToggle />
    <Button type="primary"> {t("login")}</Button>
  </div>;
};

export default Home;
