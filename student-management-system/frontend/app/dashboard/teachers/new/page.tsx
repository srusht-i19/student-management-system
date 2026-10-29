'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TeacherForm from '@/components/TeacherForm';
import { useToast } from '@/components/ToastProvider';
import { createTeacher, getErrorMessage } from '@/lib/api';
import type { TeacherInput } from '@/types/teacher';

export default function NewTeacherPage() {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState('');

  const onSubmit = async (data: TeacherInput) => {
    setError('');
    try {
      await createTeacher(data);
      toast('Teacher added');
      router.push('/dashboard/teachers');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/teachers" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to teachers</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Add teacher</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        <TeacherForm submitLabel="Add teacher" onSubmit={onSubmit} serverError={error} />
      </div>
    </div>
  );
}
