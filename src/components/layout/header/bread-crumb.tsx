'use client';

import { useMenuStore } from '@/stores/menu-store';
import type { MenuRecord } from '@/types/menu';
import { Breadcrumb } from 'antd';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function BreadcrumbLayout() {
  const [breadcrumbs, setBreadcrumbs] = useState<{ title: React.ReactNode }[]>(
    [],
  );
  const pathname = usePathname();
  const menuList = useMenuStore((state) => state.menuList);

  useEffect(() => {
    const matchedRoutes = matchRoutes(menuList, pathname);
    const crumbs = matchedRoutes.map((route) => ({
      title: <span>{route.name}</span>,
    }));
    setBreadcrumbs(crumbs);
  }, [pathname, menuList]);

  return (
    <div className="flex-center-v px-4">
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}

function matchRoutes(routes: MenuRecord[], pathname: string): MenuRecord[] {
  const segments = pathname.split('/').filter(Boolean);
  let currentRoutes = routes;
  const matched: MenuRecord[] = [];

  for (const segment of segments) {
    const found = currentRoutes.find(
      (route) =>
        route.path === `/${segment}` || route.path.includes(`:${segment}`),
    );
    if (!found) break;
    matched.push(found);
    if (found.children) currentRoutes = found.children;
  }

  return matched;
}
