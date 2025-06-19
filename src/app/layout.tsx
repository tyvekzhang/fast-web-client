import { AntdProvider } from '@/providers/antd-provider';
// import { AuthProvider } from '@/providers/auth-provider';
import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fast Web Client',
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
        <AntdProvider>
          {/*<AuthProvider>{children}</AuthProvider>*/}
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
