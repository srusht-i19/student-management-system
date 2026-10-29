'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ListMeta, ListParams, ListResult } from '@/types/list';
import { getErrorMessage } from './api';

/**
 * Frontend twin of the backend List View Builder: one hook that handles
 * debounced search, server-side pagination, sorting, loading and errors.
 * `fetcher` must be a stable function (declared outside the component).
 */
export function useListView<T>(fetcher: (params: ListParams) => Promise<ListResult<T>>, pageSize = 8) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<ListMeta>({ total: 0, page: 1, limit: pageSize, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const latestRequest = useRef(0);

  // Wait until the user stops typing, then go back to page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current; // ignore answers that arrive late
    setLoading(true);
    setError('');
    try {
      const result = await fetcher({
        search: debouncedSearch || undefined,
        page,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortBy ? sortOrder : undefined,
      });
      if (requestId !== latestRequest.current) return;
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      if (requestId === latestRequest.current) setError(getErrorMessage(err));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [fetcher, debouncedSearch, page, pageSize, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  /** Click on a column header: same column flips direction, a new column starts ascending. */
  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  /** After a delete: step back a page if the last row of the last page was removed. */
  const afterDelete = () => {
    if (data.length === 1 && page > 1) setPage(page - 1);
    else load();
  };

  return { data, meta, loading, error, search, setSearch, page, setPage, sortBy, sortOrder, toggleSort, reload: load, afterDelete };
}
