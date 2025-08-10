'use client';

import { useMenuStore } from '@/stores/menu-store';
import { MenuRecord } from '@/types/menu';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
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
    const crumbs = matchedRoutes.map((route, index) => ({
      title:
        index === 0 ? (
          <span>{route.name}</span>
        ) : (
          <Link href={route.path}>{route.name}</Link>
        ),
    }));
    setBreadcrumbs(crumbs);
  }, [pathname, menuList]);

  return (
    <div className="flex-center-v px-2 font-medium">
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}

function matchRoutes(routes: MenuRecord[], pathname: string): MenuRecord[] {
  const matched: MenuRecord[] = [];

  function findRoute(
    pathParts: string[],
    currentRoutes: MenuRecord[],
    currentIndex: number,
  ): boolean {
    if (currentIndex >= pathParts.length) return false;

    const currentPath = '/' + pathParts.slice(0, currentIndex + 1).join('/');

    for (const route of currentRoutes) {
      if (
        route.path === currentPath ||
        (route.path.includes(':') &&
          route.path.split('/').length === currentPath.split('/').length)
      ) {
        matched.push(route);

        if (
          route.children &&
          route.children.length > 0 &&
          currentIndex < pathParts.length - 1
        ) {
          if (findRoute(pathParts, route.children, currentIndex + 1)) {
            return true;
          }
        }
        return true;
      }
    }
    return false;
  }

  const pathParts = pathname.split('/').filter((part) => part !== '');
  findRoute(pathParts, routes, 0);

  return matched;
}
