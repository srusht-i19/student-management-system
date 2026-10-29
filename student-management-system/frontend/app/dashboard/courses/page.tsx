'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import CourseTable from '@/components/CourseTable';
import ListShell from '@/components/ListShell';
import { useToast } from '@/components/ToastProvider';
import { deleteCourse, getCourses, getErrorMessage } from '@/lib/api';
import { useListView } from '@/lib/useListView';
import type { Course } from '@/types/course';

export default function CoursesPage() {
  const toast = useToast();
  const list = useListView<Course>(getCourses);
  const [toDelete, setToDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(toDelete.id);
      toast(`${toDelete.name} was deleted`);
      setToDelete(null);
      list.afterDelete();
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ListShell
        title="Courses"
        subtitle={`${list.meta.total} in total`}
        addHref="/dashboard/courses/new"
        addLabel="Add Course"
        searchPlaceholder="Search by code, name or description"
        search={list.search}
        onSearch={list.setSearch}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        isEmpty={list.data.length === 0}
        emptyTitle="No courses yet."
        emptyHint="Add your first course, for example B.Tech or BCA."
        meta={list.meta}
        onPage={list.setPage}
      >
        <CourseTable courses={list.data} sortBy={list.sortBy} sortOrder={list.sortOrder} onSort={list.toggleSort} onDelete={setToDelete} />
      </ListShell>

      <ConfirmModal
        open={!!toDelete}
        title="Delete course"
        message={`Are you sure you want to delete ${toDelete?.name ?? ''}? This cannot be undone.`}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
