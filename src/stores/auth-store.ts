import { APP_CONFIG } from '@/config';
import { login } from '@/service/auth-service';
import type { LoginRequest, Token } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: Token | null;
  loading: boolean;
  login: (loginRequest: LoginRequest) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      loading: false,

      login: async (loginRequest: LoginRequest) => {
        set({ loading: true });
        try {
          const response = await login(loginRequest);
          debugger
          set({
            token: response,
            loading: false
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: APP_CONFIG.STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        token: state.token,
      }),
      skipHydration: true,
    },
  ),
);