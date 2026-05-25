import { get, post } from '@/services/api.client';
import type { User } from '@/store/auth.store';

export interface AuthSession {
  user: User;
  accessToken: string;
}

export interface RefreshSession {
  accessToken: string;
}

export const authService = {
  register: (name: string, email: string, password: string): Promise<AuthSession> =>
    post<AuthSession>('/api/auth/register', { name, email, password }),

  login: (email: string, password: string): Promise<AuthSession> =>
    post<AuthSession>('/api/auth/login', { email, password }),

  logout: (): Promise<null> => post<null>('/api/auth/logout'),

  getMe: (): Promise<User> => get<User>('/api/auth/me'),

  refreshToken: (): Promise<RefreshSession> => post<RefreshSession>('/api/auth/refresh'),
};
