import Link from 'next/link';
import type { Teacher } from '@/types/teacher';
import SortableTh from './SortableTh';
import { StatusChip } from './StudentTable';

const PALETTE = ['bg-ink text-white', 'bg-gold text-ink', 'bg-mint text-white', 'bg-ink-500 text-white'];

interface Props {
  teachers: Teacher[];
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: string) => void;
  onDelete: (teacher: Teacher) => void;
}

export default function TeacherTable({ teachers, sortBy, sortOrder, onSort, onDelete }: Props) {
  const th = { sortBy, sortOrder, onSort };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-ink-100 bg-paper text-ink-500">
          <tr>
            <SortableTh label="Name" field="first_name" {...th} />
            <SortableTh label="Email" field="email" {...th} />
            <SortableTh label="Department" field="department" {...th} />
            <SortableTh label="Designation" field="designation" {...th} />
            <SortableTh label="Status" field="status" {...th} />
            <SortableTh label="Actions" sortOrder={sortOrder} className="text-right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {teachers.map((t) => (
            <tr key={t.id} className="hover:bg-paper/70">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${PALETTE[t.id % PALETTE.length]}`}>
                    {`${t.first_name[0]}${t.last_name[0]}`.toUpperCase()}
                  </span>
                  <span className="font-semibold">{t.first_name} {t.last_name}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-ink-500">{t.email}</td>
              <td className="px-5 py-3.5">{t.department}</td>
              <td className="px-5 py-3.5">{t.designation}</td>
              <td className="px-5 py-3.5"><StatusChip status={t.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <Link href={`/dashboard/teachers/${t.id}/edit`} aria-label={`Edit ${t.first_name} ${t.last_name}`} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  </Link>
                  <button onClick={() => onDelete(t)} aria-label={`Delete ${t.first_name} ${t.last_name}`} className="rounded-lg p-2 text-ink-500 hover:bg-rose-50 hover:text-rose">
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
