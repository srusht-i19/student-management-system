'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import StudentForm from '@/components/StudentForm';
import { useToast } from '@/components/ToastProvider';
import { getErrorMessage, getStudent, updateStudent } from '@/lib/api';
import type { Student, StudentInput } from '@/types/student';

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getStudent(id).then(setStudent).catch((err) => setLoadError(getErrorMessage(err)));
  }, [id]);

  const onSubmit = async (data: StudentInput) => {
    setError('');
    try {
      await updateStudent(id, data);
      toast('Student updated');
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to students</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit student</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        {loadError ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-rose">{loadError}</p>
            <Link href="/dashboard"><Button variant="ghost" className="mt-4">Back to students</Button></Link>
          </div>
        ) : !student ? (
          <div className="grid place-items-center py-16 text-ink-500"><Spinner size={32} /></div>
        ) : (
          <StudentForm initial={student} submitLabel="Save changes" onSubmit={onSubmit} serverError={error} />
        )}
      </div>
    </div>
  );
}
