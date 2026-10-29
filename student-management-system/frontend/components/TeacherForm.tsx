'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import type { Teacher, TeacherInput } from '@/types/teacher';
import Button from './Button';
import { Input, Select } from './Input';

type Values = {
  first_name: string; last_name: string; email: string; phone: string;
  department: string; designation: string; status: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Commerce', 'Management', 'Science', 'Mathematics'];
const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Head of Department'];

const toValues = (t?: Teacher): Values => ({
  first_name: t?.first_name ?? '',
  last_name: t?.last_name ?? '',
  email: t?.email ?? '',
  phone: t?.phone ?? '',
  department: t?.department ?? '',
  designation: t?.designation ?? '',
  status: t?.status ?? 'Active',
});

function validate(v: Values): Errors {
  const e: Errors = {};
  const len = (x: string) => x.trim().length;
  if (len(v.first_name) < 2 || len(v.first_name) > 50) e.first_name = 'Enter 2-50 characters.';
  if (len(v.last_name) < 2 || len(v.last_name) > 50) e.last_name = 'Enter 2-50 characters.';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (v.phone && !/^\d{10}$/.test(v.phone)) e.phone = 'Phone must be exactly 10 digits.';
  if (len(v.department) < 2 || len(v.department) > 100) e.department = 'Enter 2-100 characters.';
  if (len(v.designation) < 2 || len(v.designation) > 100) e.designation = 'Enter 2-100 characters.';
  return e;
}

interface Props {
  initial?: Teacher;
  submitLabel: string;
  onSubmit: (data: TeacherInput) => Promise<void>;
  serverError?: string;
}

export default function TeacherForm({ initial, submitLabel, onSubmit, serverError }: Props) {
  const [values, setValues] = useState<Values>(toValues(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const bind = (name: keyof Values) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [name]: e.target.value })),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSubmit({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        phone: values.phone || undefined,
        department: values.department.trim(),
        designation: values.designation.trim(),
        status: values.status as TeacherInput['status'],
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose">{serverError}</div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" autoComplete="off" {...bind('first_name')} />
        <Input label="Last name" autoComplete="off" {...bind('last_name')} />
        <Input label="Email" type="email" autoComplete="off" {...bind('email')} />
        <Input label="Phone (optional)" inputMode="numeric" maxLength={10} hint="10-digit mobile number" {...bind('phone')} />
        <div>
          <Input label="Department" list="department-list" {...bind('department')} />
          <datalist id="department-list">{DEPARTMENTS.map((d) => <option key={d} value={d} />)}</datalist>
        </div>
        <div>
          <Input label="Designation" list="designation-list" {...bind('designation')} />
          <datalist id="designation-list">{DESIGNATIONS.map((d) => <option key={d} value={d} />)}</datalist>
        </div>
        <Select label="Status" {...bind('status')}>
          <option>Active</option><option>Inactive</option>
        </Select>
      </div>
      <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
        <Link href="/dashboard/teachers"><Button type="button" variant="ghost">Cancel</Button></Link>
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
}
