import Link from 'next/link';
import type { Student } from '@/types/student';

const PALETTE = ['bg-ink text-white', 'bg-gold text-ink', 'bg-mint text-white', 'bg-ink-500 text-white'];

export function Avatar({ student }: { student: Student }) {
  const initials = `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${PALETTE[student.id % PALETTE.length]}`}>
      {initials}
    </span>
  );
}

export function StatusChip({ status }: { status: Student['status'] }) {
  const active = status === 'Active';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-mint-50 text-mint-700' : 'bg-ink-100 text-ink-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-mint' : 'bg-ink-500'}`} />
      {status}
    </span>
  );
}

interface Props {
  students: Student[];
  onDelete: (student: Student) => void;
}

export default function StudentTable({ students, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-ink-100 bg-paper text-ink-500">
          <tr>
            {['Name', 'Email', 'Course', 'Year', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-5 py-3 font-semibold last:text-right">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {students.map((s) => (
            <tr key={s.id} className="hover:bg-paper/70">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar student={s} />
                  <span className="font-semibold">{s.first_name} {s.last_name}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-ink-500">{s.email}</td>
              <td className="px-5 py-3.5">{s.course}</td>
              <td className="px-5 py-3.5">Year {s.year}</td>
              <td className="px-5 py-3.5"><StatusChip status={s.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <Link
                    href={`/dashboard/students/${s.id}/edit`}
                    aria-label={`Edit ${s.first_name} ${s.last_name}`}
                    className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  </Link>
                  <button
                    onClick={() => onDelete(s)}
                    aria-label={`Delete ${s.first_name} ${s.last_name}`}
                    className="rounded-lg p-2 text-ink-500 hover:bg-rose-50 hover:text-rose"
                  >
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
