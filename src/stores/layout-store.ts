import { create } from 'zustand';

interface LayoutState {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  collapsed: false,
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));
