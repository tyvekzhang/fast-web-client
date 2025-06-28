import type { RouteObject } from '@/types/route';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TagsState {
  visitedTags: RouteObject[];
  addVisitedTags: (route: RouteObject) => void;
  closeTagByKey: (
    path: string,
  ) => Promise<{ tagIndex: number; tagsList: RouteObject[] } | null>;
  closeTagsByType: (params: {
    type: 'other' | 'left' | 'right';
    path: string;
  }) => void;
  closeAllTags: () => Promise<RouteObject[]>;
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      visitedTags: [],

      addVisitedTags: (route: RouteObject) => {
        set((state) => {
          const exists = state.visitedTags.some(
            (tag) => tag.fullPath === route.fullPath,
          );
          if (!exists) {
            return {
              visitedTags: [
                ...state.visitedTags,
                { ...route, fullPath: route.fullPath || route.path },
              ],
            };
          }
          return state;
        });
      },

      closeTagByKey: async (path: string) => {
        return new Promise((resolve) => {
          set((state) => {
            const tagIndex = state.visitedTags.findIndex(
              (tag) => tag.fullPath === path,
            );
            if (tagIndex === -1) {
              resolve(null);
              return state;
            }

            const tag = state.visitedTags[tagIndex];
            if (tag.meta?.affix) {
              resolve(null);
              return state;
            }

            const newTags = state.visitedTags.filter(
              (tag) => tag.fullPath !== path,
            );
            resolve({ tagIndex, tagsList: newTags });

            return {
              visitedTags: newTags,
            };
          });
        });
      },

      closeTagsByType: (params: {
        type: 'other' | 'left' | 'right';
        path: string;
      }) => {
        set((state) => {
          const currentIndex = state.visitedTags.findIndex(
            (tag) => tag.fullPath === params.path,
          );
          if (currentIndex === -1) return state;

          let newTags: RouteObject[] = [];

          switch (params.type) {
            case 'other':
              newTags = state.visitedTags.filter(
                (tag) => tag.fullPath === params.path || tag.meta?.affix,
              );
              break;
            case 'left':
              newTags = [
                ...state.visitedTags
                  .slice(0, currentIndex + 1)
                  .filter((tag) => tag.meta?.affix),
                ...state.visitedTags.slice(currentIndex),
              ];
              break;
            case 'right':
              newTags = [
                ...state.visitedTags.slice(0, currentIndex + 1),
                ...state.visitedTags
                  .slice(currentIndex + 1)
                  .filter((tag) => tag.meta?.affix),
              ];
              break;
          }

          return { visitedTags: newTags };
        });
      },

      closeAllTags: async () => {
        return new Promise((resolve) => {
          set((state) => {
            const affixTags = state.visitedTags.filter(
              (tag) => tag.meta?.affix,
            );
            resolve(affixTags);
            return { visitedTags: affixTags };
          });
        });
      },
    }),
    { name: 'tags-store' },
  ),
);
