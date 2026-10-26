'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import Logo from '@/components/Logo';
import { getErrorMessage, login, saveSession, TOKEN_KEY } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in? Skip the form.
  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) router.replace('/dashboard');
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    const found: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) found.email = 'Enter a valid email address.';
    if (!password) found.password = 'Enter your password.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const { accessToken, user } = await login(email, password);
      saveSession(accessToken, user.email);
      router.replace('/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Logo light />
        <div>
          <p className="font-display text-4xl font-bold leading-tight">
            Good to see you back. Your register is waiting.
          </p>
          <p className="mt-4 max-w-sm text-ink-200">
            Sign in to add new students, update records and keep enrolment up to date.
          </p>
        </div>
        <div className="absolute -right-16 bottom-16 h-56 w-56 rounded-full bg-gold" aria-hidden />
        <p className="text-sm text-ink-200">&copy; {new Date().getFullYear()} Rollbook</p>
      </aside>

      <section className="grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <div className="rounded-2xl bg-white p-7 shadow-lift sm:p-9">
            <h1 className="text-2xl font-bold">Log in</h1>
            <p className="mt-1 text-sm text-ink-500">Use the admin account from your backend .env file.</p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              {apiError && (
                <div role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose">
                  {apiError}
                </div>
              )}
              <Input label="Email" name="email" type="email" autoComplete="username" value={email}
                onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <Input label="Password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
                rightSlot={
                  <button type="button" onClick={() => setShow((s) => !s)}
                    className="rounded px-2 py-1 text-xs font-semibold text-ink-500 hover:text-ink">
                    {show ? 'Hide' : 'Show'}
                  </button>
                } />
              <Button type="submit" loading={loading} className="w-full !py-3">Log in</Button>
            </form>
          </div>
          <p className="mt-6 text-center text-sm text-ink-500">
            <Link href="/" className="font-semibold text-ink hover:underline">Back to home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
