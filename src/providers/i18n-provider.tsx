'use client';

import i18n from '@/lib/i18n';
import { Spin } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    i18n.on('initialized', () => {
      setIsInitialized(true);
    });

    if (i18n.isInitialized) {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
