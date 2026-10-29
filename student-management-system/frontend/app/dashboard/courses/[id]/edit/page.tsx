'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import CourseForm from '@/components/CourseForm';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ToastProvider';
import { getCourse, getErrorMessage, updateCourse } from '@/lib/api';
import type { Course, CourseInput } from '@/types/course';

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getCourse(id).then(setCourse).catch((err) => setLoadError(getErrorMessage(err)));
  }, [id]);

  const onSubmit = async (data: CourseInput) => {
    setError('');
    try {
      await updateCourse(id, data);
      toast('Course updated');
      router.push('/dashboard/courses');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/courses" className="text-sm font-semibold text-ink-500 hover:text-ink">Back to courses</Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit course</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        {loadError ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-rose">{loadError}</p>
            <Link href="/dashboard/courses"><Button variant="ghost" className="mt-4">Back to courses</Button></Link>
          </div>
        ) : !course ? (
          <div className="grid place-items-center py-16 text-ink-500"><Spinner size={32} /></div>
        ) : (
          <CourseForm initial={course} submitLabel="Save changes" onSubmit={onSubmit} serverError={error} />
        )}
      </div>
    </div>
  );
}
