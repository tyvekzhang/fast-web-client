import { authService } from '@/service/auth-service';
import type { AuthState, LoginCredentials, User } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '@/config';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ loading: true });
          const response = await authService.login(credentials);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: APP_CONFIG.STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
