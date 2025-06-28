import { AntdProvider } from '@/providers/antd-provider';
// import { AuthProvider } from '@/providers/login-provider';
import '@/app/globals.css';
import { I18nProvider } from '@/providers/i18n-provider';
import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'FastWeb',
  description: 'One of the best scaffold in PyWeb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AntdProvider>
            {/*<AuthProvider>{children}</AuthProvider>*/}
            {children}
          </AntdProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
