'use client';
import { useLayoutStore } from '@/stores/layout-store';
import Image from 'next/image';
import { APP_CONFIG } from '@/config';

export function Logo() {
  const { collapsed } = useLayoutStore();

  return (
    <div className="h-16 flex items-center justify-center gap-2 text-gray-300 text-lg">
      {collapsed ? (
        <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      ) : (
        <>
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span>{APP_CONFIG.NAME}</span>
        </>
      )}
    </div>
  );
}
