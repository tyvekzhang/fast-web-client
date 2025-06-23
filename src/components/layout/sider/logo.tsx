'use client';
import { useLayoutStore } from '@/stores/layout-store';
import Image from 'next/image';

export function Logo() {
  const { collapsed } = useLayoutStore();

  return (
    <div className="h-16 flex items-center justify-center border-b">
      {collapsed ? (
        <Image
          src="/logo-icon.png"
          alt="Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      ) : (
        <Image
          src="/logo-full.png"
          alt="Logo"
          width={160}
          height={40}
          className="object-contain"
        />
      )}
    </div>
  );
}
