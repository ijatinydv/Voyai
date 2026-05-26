'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthUser } from '@/types';

export type User = AuthUser;

const ACCESS_TOKEN_COOKIE = 'accessToken';
const COOKIE_MAX_AGE_SECONDS = 60 * 60;

function writeAccessTokenCookie(token: string | null): void {
  if (typeof document === 'undefined') return;

  if (!token) {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

const normalizeUser = (user: Partial<AuthUser> & Pick<AuthUser, 'id' | 'email'>): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name ?? user.email.split('@')[0] ?? 'Traveler',
  avatarUrl: user.avatarUrl,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: Boolean(user && get().accessToken) });
      },
      setToken: (token) => {
        writeAccessTokenCookie(token);
        set({ accessToken: token, isAuthenticated: Boolean(token && get().user) });
      },
      logout: () => {
        writeAccessTokenCookie(null);
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      },
      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          const { authService } = await import('@/services/auth.service');
          let token = get().accessToken;

          if (!token) {
            const refreshed = await authService.refreshToken();
            token = refreshed.accessToken;
            get().setToken(token);
          } else {
            writeAccessTokenCookie(token);
          }

          const user = await authService.getMe();
          set({ user: normalizeUser(user), accessToken: token, isAuthenticated: true });
        } catch {
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'voyai-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) writeAccessTokenCookie(state.accessToken);
      },
    },
  ),
);
