'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import TeacherForm from '@/components/TeacherForm';
import { useToast } from '@/components/ToastProvider';
import { getErrorMessage, getTeacher, updateTeacher } from '@/lib/api';
import type { Teacher, TeacherInput } from '@/types/teacher';

export default function EditTeacherPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getTeacher(id).then(setTeacher).catch((err) => setLoadError(getErrorMessage(err)));
  }, [id]);

  const onSubmit = async (data: TeacherInput) => {
    setError('');
    try {
      await updateTeacher(id, data);
      toast('Teacher updated');
      router.push('/dashboard/teachers');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/teachers" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to teachers</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit teacher</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        {loadError ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-rose">{loadError}</p>
            <Link href="/dashboard/teachers"><Button variant="ghost" className="mt-4">Back to teachers</Button></Link>
          </div>
        ) : !teacher ? (
          <div className="grid place-items-center py-16 text-ink-500"><Spinner size={32} /></div>
        ) : (
          <TeacherForm initial={teacher} submitLabel="Save changes" onSubmit={onSubmit} serverError={error} />
        )}
      </div>
    </div>
  );
}
