import Link from 'next/link';
import type { Course } from '@/types/course';
import SortableTh from './SortableTh';
import { StatusChip } from './StudentTable';

interface Props {
  courses: Course[];
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: string) => void;
  onDelete: (course: Course) => void;
}

export default function CourseTable({ courses, sortBy, sortOrder, onSort, onDelete }: Props) {
  const th = { sortBy, sortOrder, onSort };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-ink-100 bg-paper text-ink-500">
          <tr>
            <SortableTh label="Code" field="code" {...th} />
            <SortableTh label="Name" field="name" {...th} />
            <SortableTh label="Duration" field="duration_years" {...th} />
            <SortableTh label="Status" field="status" {...th} />
            <SortableTh label="Actions" sortOrder={sortOrder} className="text-right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {courses.map((c) => (
            <tr key={c.id} className="hover:bg-paper/70">
              <td className="px-5 py-3.5">
                <span className="rounded-md bg-ink-100 px-2 py-1 font-mono text-xs font-semibold">{c.code}</span>
              </td>
              <td className="px-5 py-3.5">
                <p className="font-semibold">{c.name}</p>
                {c.description && <p className="mt-0.5 max-w-xs truncate text-xs text-ink-500">{c.description}</p>}
              </td>
              <td className="px-5 py-3.5">{c.duration_years} {c.duration_years === 1 ? 'year' : 'years'}</td>
              <td className="px-5 py-3.5"><StatusChip status={c.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <Link href={`/dashboard/courses/${c.id}/edit`} aria-label={`Edit ${c.name}`} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  </Link>
                  <button onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`} className="rounded-lg p-2 text-ink-500 hover:bg-rose-50 hover:text-rose">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
