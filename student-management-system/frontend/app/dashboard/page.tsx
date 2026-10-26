'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import ConfirmModal from '@/components/ConfirmModal';
import Spinner from '@/components/Spinner';
import StudentTable from '@/components/StudentTable';
import { useToast } from '@/components/ToastProvider';
import { deleteStudent, getErrorMessage, getStudents } from '@/lib/api';
import type { Student } from '@/types/student';

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const toast = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError('');
    try {
      setStudents(await getStudents(q));
      setPage(1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the search box so we don't call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteStudent(toDelete.id);
      toast(`${toDelete.first_name} ${toDelete.last_name} was deleted`);
      setToDelete(null);
      await load(search);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const pages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const visible = useMemo(() => students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [students, page]);
  const active = students.filter((s) => s.status === 'Active').length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="mt-1 text-ink-500">
            {students.length} shown, {active} active
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button variant="accent">Add Student</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lift">
        <div className="border-b border-ink-100 p-4">
          <label htmlFor="search" className="sr-only">Search students</label>
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or course"
              className="w-full rounded-lg border border-ink-200 bg-paper py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-500/60"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20 text-ink-500"><Spinner size={32} /></div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-semibold text-rose">{error}</p>
            <Button variant="ghost" className="mt-4" onClick={() => load(search)}>Try again</Button>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-semibold">{search ? 'No students match your search.' : 'No students yet.'}</p>
            <p className="mt-1 text-sm text-ink-500">
              {search ? 'Try a different name, email or course.' : 'Add your first student to start the register.'}
            </p>
            {!search && (
              <Link href="/dashboard/students/new"><Button variant="accent" className="mt-5">Add Student</Button></Link>
            )}
          </div>
        ) : (
          <>
            <StudentTable students={visible} onDelete={setToDelete} />
            {pages > 1 && (
              <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm">
                <span className="text-ink-500">Page {page} of {pages}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" className="!py-1.5" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                  <Button variant="ghost" className="!py-1.5" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Delete student"
        message={`Are you sure you want to delete ${toDelete?.first_name ?? ''} ${toDelete?.last_name ?? ''}? This cannot be undone.`}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
