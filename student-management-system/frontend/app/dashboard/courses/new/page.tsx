'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CourseForm from '@/components/CourseForm';
import { useToast } from '@/components/ToastProvider';
import { createCourse, getErrorMessage } from '@/lib/api';
import type { CourseInput } from '@/types/course';

export default function NewCoursePage() {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState('');

  const onSubmit = async (data: CourseInput) => {
    setError('');
    try {
      await createCourse(data);
      toast('Course added');
      router.push('/dashboard/courses');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/courses" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to courses</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Add course</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        <CourseForm submitLabel="Add course" onSubmit={onSubmit} serverError={error} />
      </div>
    </div>
  );
}
