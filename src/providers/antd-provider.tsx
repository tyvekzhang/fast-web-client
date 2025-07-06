'use client';

import { APP_CONFIG } from '@/config';
import { oklchToHex } from '@/lib/utils';
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

  const styles = getComputedStyle(document.documentElement);
  const colorPrimary = oklchToHex(styles.getPropertyValue('--color-primary'));
  const primaryDarkBg = oklchToHex(
    styles.getPropertyValue('--color-primary-bg'),
  );
  const submenuDarkBg = oklchToHex(
    styles.getPropertyValue('--color-submenu-bg'),
  );
  const itemSelectedColor = oklchToHex(
    styles.getPropertyValue('--color-on-surface-var'),
  );
  const itemHoverColor = oklchToHex(
    styles.getPropertyValue('--color-on-surface-var'),
  );

  return (
    <AntdRegistry>
      <StyleProvider layer>
        <ConfigProvider
          prefixCls={APP_CONFIG.PREFIX_CLS}
          locale={language === 'zh' ? zhCN : enUS}
          theme={{
            token: {
              colorPrimary: colorPrimary,
            },
            components: {
              Menu: {
                darkItemBg: primaryDarkBg,
                darkSubMenuItemBg: submenuDarkBg,
                darkPopupBg: submenuDarkBg,
                darkItemSelectedColor: itemSelectedColor,
                darkItemHoverColor: itemHoverColor,
              },
              Layout: {
                siderBg: primaryDarkBg,
              },
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
