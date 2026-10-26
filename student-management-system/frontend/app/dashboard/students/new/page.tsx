'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/StudentForm';
import { useToast } from '@/components/ToastProvider';
import { createStudent, getErrorMessage } from '@/lib/api';
import type { StudentInput } from '@/types/student';

export default function NewStudentPage() {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState('');

  const onSubmit = async (data: StudentInput) => {
    setError('');
    try {
      await createStudent(data);
      toast('Student added');
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to students</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Add student</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        <StudentForm submitLabel="Add student" onSubmit={onSubmit} serverError={error} />
      </div>
    </div>
  );
}
