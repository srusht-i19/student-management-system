'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import ListShell from '@/components/ListShell';
import TeacherTable from '@/components/TeacherTable';
import { useToast } from '@/components/ToastProvider';
import { deleteTeacher, getErrorMessage, getTeachers } from '@/lib/api';
import { useListView } from '@/lib/useListView';
import type { Teacher } from '@/types/teacher';

export default function TeachersPage() {
  const toast = useToast();
  const list = useListView<Teacher>(getTeachers);
  const [toDelete, setToDelete] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTeacher(toDelete.id);
      toast(`${toDelete.first_name} ${toDelete.last_name} was deleted`);
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
        title="Teachers"
        subtitle={`${list.meta.total} in total`}
        addHref="/dashboard/teachers/new"
        addLabel="Add Teacher"
        searchPlaceholder="Search by name, email, department or designation"
        search={list.search}
        onSearch={list.setSearch}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        isEmpty={list.data.length === 0}
        emptyTitle="No teachers yet."
        emptyHint="Add your first teacher to start the staff list."
        meta={list.meta}
        onPage={list.setPage}
      >
        <TeacherTable teachers={list.data} sortBy={list.sortBy} sortOrder={list.sortOrder} onSort={list.toggleSort} onDelete={setToDelete} />
      </ListShell>

      <ConfirmModal
        open={!!toDelete}
        title="Delete teacher"
        message={`Are you sure you want to delete ${toDelete?.first_name ?? ''} ${toDelete?.last_name ?? ''}? This cannot be undone.`}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
