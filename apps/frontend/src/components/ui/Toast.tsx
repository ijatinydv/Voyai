'use client';

import { useEffect, useState } from 'react';
import { useToastStore, type Toast as ToastModel, type ToastType } from '@/store/toast.store';
import { cn } from '@/utils/cn';

const toastIcon: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
};

const toastClasses: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-red-200 bg-red-50 text-red-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  info: 'border-sky-200 bg-sky-50 text-sky-950',
};

function ToastItem({ toast }: { toast: ToastModel }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const dismissTimer = window.setTimeout(() => setIsLeaving(true), 4000);
    return () => window.clearTimeout(dismissTimer);
  }, []);

  useEffect(() => {
    if (!isLeaving) return undefined;

    const removeTimer = window.setTimeout(() => removeToast(toast.id), 180);
    return () => window.clearTimeout(removeTimer);
  }, [isLeaving, removeToast, toast.id]);

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-xl shadow-navy-950/10 backdrop-blur',
        'transition-all duration-150 ease-out',
        isLeaving ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100',
        toastClasses[toast.type],
      )}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-sm font-semibold">
        {toastIcon[toast.type]}
      </span>
      <p className="min-w-0 flex-1 text-sm font-medium leading-5">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setIsLeaving(true)}
        className="rounded p-0.5 text-current opacity-60 transition-opacity duration-150 ease-out hover:opacity-100"
      >
        ✗
      </button>
    </div>
  );
}

export function Toast() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[500] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
