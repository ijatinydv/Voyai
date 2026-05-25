import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiErrorResponse, ApiResponse } from '@voyai/types';
import { useAuthStore } from '@/store/auth.store';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const baseURL = rawBaseUrl.replace(/\/$/, '');

let refreshPromise: Promise<string> | null = null;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function normalizeEndpoint(endpoint: string): string {
  if (baseURL.endsWith('/api') && endpoint.startsWith('/api/')) {
    return endpoint.replace(/^\/api/, '');
  }

  return endpoint;
}

function extractErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  if (!error.response) {
    return 'We could not reach Voyai. Check your connection and try again.';
  }

  const apiMessage = error.response.data?.error?.message;
  if (apiMessage) return apiMessage;

  if (error.response.status >= 500) {
    return 'Voyai is having trouble right now. Please try again in a moment.';
  }

  return 'Something went wrong. Please try again.';
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<RefreshResponse>>(`${baseURL}${normalizeEndpoint('/api/auth/refresh')}`, null, {
        withCredentials: true,
      })
      .then((response) => response.data.data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.url) {
    config.url = normalizeEndpoint(config.url);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        useAuthStore.getState().setToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(new Error(extractErrorMessage(error)));
  },
);

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request;
  return response.data.data;
}

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  unwrap(apiClient.get<ApiResponse<T>>(url, config));

export const post = <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
  unwrap(apiClient.post<ApiResponse<T>>(url, data, config));

export const put = <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
  unwrap(apiClient.put<ApiResponse<T>>(url, data, config));

export const patch = <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
  unwrap(apiClient.patch<ApiResponse<T>>(url, data, config));

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  unwrap(apiClient.delete<ApiResponse<T>>(url, config));

export { del as delete };
