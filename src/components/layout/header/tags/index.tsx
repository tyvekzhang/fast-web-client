'use client';

import { useMenuStore } from '@/stores/menu-store';
import { useTagsStore } from '@/stores/tag-store';
import { RouteObject, searchRoute } from '@/utils/navigation-util';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import TagItem from './tag-item';

const TagsLayout: React.FC = () => {
  const { getRoutes } = useMenuStore();
  const basicRoutes = getRoutes();
  const router = useRouter();
  const pathname = usePathname();

  const {
    visitedTags,
    addVisitedTags,
    closeTagByKey,
    closeTagsByType,
    closeAllTags,
  } = useTagsStore();

  // Refs for tags container elements
  const tagsMain = useRef<HTMLDivElement>(null);
  const tagsMainCont = useRef<HTMLDivElement>(null);

  const [tagsContLeft, setTagsContLeft] = useState(0);
  const [activeTag, setActiveTag] = useState(pathname);

  // Initialize affix tags from route configuration
  const initAffixTags = useCallback(
    (routes: RouteObject[], basePath = '/'): RouteObject[] => {
      let affixTags: RouteObject[] = [];

      for (const route of routes) {
        if (route.meta?.affix) {
          const fullPath = route.path.startsWith('/')
            ? route.path
            : basePath + route.path;
          affixTags.push({ ...route, fullPath });
        }

        if (route.children && route.children.length) {
          affixTags = affixTags.concat(
            initAffixTags(route.children, route.path),
          );
        }
      }

      return affixTags;
    },
    [],
  );

  const moveToActiveTag = useCallback(
    (tag: HTMLElement | null) => {
      if (!tag || !tagsMain.current || !tagsMainCont.current) return;

      const mainContPadding = 4;
      const mainWidth = tagsMain.current.offsetWidth;
      const mainContWidth = tagsMainCont.current.offsetWidth;

      let leftOffset: number;

      if (mainContWidth < mainWidth) {
        leftOffset = 0;
      } else if (tag.offsetLeft < -tagsContLeft) {
        leftOffset = -tag.offsetLeft + mainContPadding;
      } else if (
        tag.offsetLeft > -tagsContLeft &&
        tag.offsetLeft + tag.offsetWidth < -tagsContLeft + mainWidth
      ) {
        leftOffset = Math.min(
          0,
          mainWidth - tag.offsetWidth - tag.offsetLeft - mainContPadding,
        );
      } else {
        leftOffset = -(
          tag.offsetLeft -
          (mainWidth - mainContPadding - tag.offsetWidth)
        );
      }

      setTagsContLeft(leftOffset);
    },
    [tagsContLeft],
  );

  useEffect(() => {
    if (!basicRoutes.length) return;
    const affixTags = initAffixTags(basicRoutes);
    if (!activeTag.length) return;
    affixTags.forEach((tag) => {
      if (!visitedTags.some((v) => v.fullPath === tag.fullPath)) {
        addVisitedTags(tag);
      }
    });
  }, [basicRoutes]);

  useEffect(() => {
    if (pathname !== activeTag) {
      const currRoute = searchRoute(pathname, basicRoutes);
      if (
        currRoute &&
        !visitedTags.some((tag) => tag.fullPath === currRoute.fullPath)
      ) {
        addVisitedTags(currRoute);
      }
      setActiveTag(pathname);
    }
  }, [pathname]);

  const handleCloseTag = useCallback(
    async (path: string) => {
      if (path === '/home') {
        return;
      }
      const result = await closeTagByKey(path);
      if (result) {
        const { tagIndex, tagsList } = result;
        const tagLen = tagsList.length;

        if (path === activeTag) {
          const currTag =
            tagIndex < tagLen ? tagsList[tagIndex] : tagsList[tagLen - 1];
          router.push(currTag.fullPath!);
        }
      }
    },
    [closeTagByKey, router, activeTag],
  );

  const handleClickTag = useCallback(
    (path: string) => {
      if (path !== activeTag) {
        setActiveTag(path);
        router.push(path);
      }
    },
    [router, activeTag],
  );

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleCloseOthers = useCallback(
    (path: string) => {
      closeTagsByType({ type: 'other', path });
    },
    [closeTagsByType],
  );

  const handleCloseLeft = useCallback(
    (path: string) => {
      closeTagsByType({ type: 'left', path });
    },
    [closeTagsByType],
  );

  const handleCloseRight = useCallback(
    (path: string) => {
      closeTagsByType({ type: 'right', path });
    },
    [closeTagsByType],
  );

  const handleCloseAll = useCallback(async () => {
    const remainingTags = await closeAllTags();
    if (remainingTags.length > 0) {
      const lastTag = remainingTags[remainingTags.length - 1];
      if (activeTag !== lastTag?.fullPath) {
        router.push(lastTag?.fullPath!);
      }
    }
  }, [closeAllTags, router, activeTag]);

  const tagItems = visitedTags.map((item: RouteObject, index: number) => (
    <span
      className="inline-block h-full"
      key={item.fullPath}
      data-path={item.fullPath}
    >
      <TagItem
        name={item.meta?.title ?? '默认'}
        fixed={item.meta?.affix}
        active={activeTag === item.fullPath}
        isFirst={index === 0}
        isLast={index === visitedTags.length - 1}
        id={item.fullPath as string}
        onClick={() => handleClickTag(item.fullPath as string)}
        closeTag={() => handleCloseTag(item.fullPath as string)}
        onCloseOthers={() => handleCloseOthers(item.fullPath as string)}
        onCloseLeft={() => handleCloseLeft(item.fullPath as string)}
        onCloseRight={() => handleCloseRight(item.fullPath as string)}
        onCloseAll={handleCloseAll}
        onRefresh={() => handleReload()}
      />
    </span>
  ));

  return (
    <div className="w-full overflow-hidden bg-gray-50">
      <div ref={tagsMain} className="w-full">
        <div
          ref={tagsMainCont}
          className="h-6 flex items-center transition-all duration-300 whitespace-nowrap"
          style={{ transform: `translateX(${tagsContLeft}px)` }}
        >
          {tagItems}
        </div>
      </div>
    </div>
  );
};

export default TagsLayout;
