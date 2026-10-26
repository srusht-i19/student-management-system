'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import { TOKEN_KEY } from '@/lib/api';

/** Guards every /dashboard page: no token means redirect to /login. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) router.replace('/login');
    else setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-500">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar mode="app" />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
