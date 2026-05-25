import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string) => string;
    error: (message: string) => string;
    warning: (message: string) => string;
    info: (message: string) => string;
  };
}

const createToastId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useToastStore = create<ToastState>((set, get) => {
  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = createToastId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  };

  return {
    toasts: [],
    addToast,
    removeToast: (id: string) => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    },
    toast: {
      success: (message: string) => get().addToast({ type: 'success', message }),
      error: (message: string) => get().addToast({ type: 'error', message }),
      warning: (message: string) => get().addToast({ type: 'warning', message }),
      info: (message: string) => get().addToast({ type: 'info', message }),
    },
  };
});
