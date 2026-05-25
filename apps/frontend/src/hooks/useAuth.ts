'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore, type User } from '@/store/auth.store';
import { useToastStore } from '@/store/toast.store';

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export function useAuth(): UseAuthResult {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeIsLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const clearAuth = useAuthStore((state) => state.logout);
  const toast = useToastStore((state) => state.toast);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await authService.login(email, password);
      setToken(session.accessToken);
      setUser(session.user);
      toast.success('Welcome back to Voyai.');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await authService.register(name, email, password);
      setToken(session.accessToken);
      setUser(session.user);
      toast.success('Your Voyai account is ready.');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create your account.';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.logout();
      toast.success('Signed out safely.');
    } catch {
      toast.warning('You are signed out locally. The server could not be reached.');
    } finally {
      clearAuth();
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: storeIsLoading || isLoading,
    error,
    login,
    logout,
    register,
  };
}
