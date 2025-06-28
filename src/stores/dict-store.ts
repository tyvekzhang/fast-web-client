import { fetchAllDictData } from '@/service/dict-data-service';
import { create } from 'zustand';

interface DictState {
  dictData: Record<string, any>;
  loading: boolean;
  fetchDictData: () => Promise<void>;
}

export const useDictStore = create<DictState>((set) => ({
  dictData: {},
  loading: false,
  fetchDictData: async () => {
    set({ loading: true });
    try {
      const data = await fetchAllDictData();
      set({ dictData: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch dict data:', error);
      set({ loading: false });
    }
  },
}));
