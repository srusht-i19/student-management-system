'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type Kind = 'success' | 'error';
interface ToastItem { id: number; kind: Kind; message: string }

const ToastContext = createContext<(message: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, kind: Kind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-in flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lift ${
              t.kind === 'success' ? 'bg-mint-700' : 'bg-rose'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
