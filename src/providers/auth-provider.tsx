'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Spin } from 'antd';
import type React from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
