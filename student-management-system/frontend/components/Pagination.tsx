import type { ListMeta } from '@/types/list';
import Button from './Button';

/** Server-side pagination controls driven by the API's `meta` object. */
export default function Pagination({ meta, onPage }: { meta: ListMeta; onPage: (page: number) => void }) {
  if (meta.totalPages <= 1) return null;
  const first = (meta.page - 1) * meta.limit + 1;
  const last = Math.min(meta.page * meta.limit, meta.total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-5 py-3 text-sm">
      <span className="text-ink-500">
        {first}-{last} of {meta.total}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="!py-1.5" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>
          Previous
        </Button>
        <span className="px-1 text-ink-500">
          Page {meta.page} of {meta.totalPages}
        </span>
        <Button variant="ghost" className="!py-1.5" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
