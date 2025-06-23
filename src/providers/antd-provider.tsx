'use client';

import { useLanguageStore } from '@/stores/language-store';
import { useThemeStore } from '@/stores/theme-store';
import { StyleProvider } from '@ant-design/cssinjs';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useThemeStore();
  const { language } = useLanguageStore();

  return (
    <AntdRegistry>
      <StyleProvider layer>
        <ConfigProvider
          locale={language === 'zh' ? zhCN : enUS}
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
            algorithm:
              currentTheme === 'dark'
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
          }}
        >
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
