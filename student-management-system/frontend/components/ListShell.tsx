import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ListMeta } from '@/types/list';
import Button from './Button';
import Pagination from './Pagination';
import Spinner from './Spinner';

interface Props {
  title: string;
  subtitle: string;
  addHref: string;
  addLabel: string;
  searchPlaceholder: string;
  search: string;
  onSearch: (value: string) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  isEmpty: boolean;
  emptyTitle: string;
  emptyHint: string;
  meta: ListMeta;
  onPage: (page: number) => void;
  children: ReactNode; // the table
}

/** Common page frame for every list view: header, search, loading/error/empty states, pagination. */
export default function ListShell(p: Props) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{p.title}</h1>
          <p className="mt-1 text-ink-500">{p.subtitle}</p>
        </div>
        <Link href={p.addHref}>
          <Button variant="accent">{p.addLabel}</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lift">
        <div className="border-b border-ink-100 p-4">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="search"
              value={p.search}
              onChange={(e) => p.onSearch(e.target.value)}
              placeholder={p.searchPlaceholder}
              className="w-full rounded-lg border border-ink-200 bg-paper py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-500/60"
            />
          </div>
        </div>

        {p.loading ? (
          <div className="grid place-items-center py-20 text-ink-500"><Spinner size={32} /></div>
        ) : p.error ? (
          <div className="py-16 text-center">
            <p className="font-semibold text-rose">{p.error}</p>
            <Button variant="ghost" className="mt-4" onClick={p.onRetry}>Try again</Button>
          </div>
        ) : p.isEmpty ? (
          <div className="py-16 text-center">
            <p className="font-semibold">{p.search ? 'No results match your search.' : p.emptyTitle}</p>
            <p className="mt-1 text-sm text-ink-500">{p.search ? 'Try different words.' : p.emptyHint}</p>
            {!p.search && (
              <Link href={p.addHref}><Button variant="accent" className="mt-5">{p.addLabel}</Button></Link>
            )}
          </div>
        ) : (
          <>
            {p.children}
            <Pagination meta={p.meta} onPage={p.onPage} />
          </>
        )}
      </div>
    </>
  );
}
