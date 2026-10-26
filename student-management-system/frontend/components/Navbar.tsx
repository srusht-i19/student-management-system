'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, USER_KEY } from '@/lib/api';
import Button from './Button';
import Logo from './Logo';

/** `public` shows a Login button; `app` shows the signed-in admin and a Logout button. */
export default function Navbar({ mode = 'public' }: { mode?: 'public' | 'app' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (mode === 'app') setEmail(localStorage.getItem(USER_KEY) ?? '');
  }, [mode]);

  const logout = () => {
    clearSession();
    router.replace('/login');
  };

  if (mode === 'app') {
    return (
      <header className="bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo light />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-200 sm:block">{email}</span>
            <Button variant="accent" onClick={logout} className="!py-2">
              Log out
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-ink-100 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo />
        <Link href="/login">
          <Button variant="primary" className="!py-2">
            Log in
          </Button>
        </Link>
      </div>
    </header>
  );
}
