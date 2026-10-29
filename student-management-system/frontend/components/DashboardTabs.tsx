'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard', label: 'Students', match: (p: string) => p === '/dashboard' || p.startsWith('/dashboard/students') },
  { href: '/dashboard/courses', label: 'Courses', match: (p: string) => p.startsWith('/dashboard/courses') },
  { href: '/dashboard/teachers', label: 'Teachers', match: (p: string) => p.startsWith('/dashboard/teachers') },
];

/** Switches between the modules inside the admin area. */
export default function DashboardTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Modules" className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                active ? 'border-gold text-ink' : 'border-transparent text-ink-500 hover:text-ink'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
