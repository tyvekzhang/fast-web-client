import { APP_CONFIG } from '@/config';
import { useLayoutStore } from '@/stores/layout-store';
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  const { collapsed } = useLayoutStore();

  return (
    <Link
      href="/"
      className="h-14 flex items-center justify-center text-gray-100 text-lg transition-all duration-75"
    >
      {collapsed ? (
        <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      ) : (
        <div className="flex gap-0.5 items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span>{APP_CONFIG.NAME}</span>
        </div>
      )}
    </Link>
  );
}
