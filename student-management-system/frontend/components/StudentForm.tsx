'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import type { Student, StudentInput } from '@/types/student';
import Button from './Button';
import { Input, Select } from './Input';

type Values = {
  first_name: string; last_name: string; email: string; phone: string;
  date_of_birth: string; gender: string; course: string; year: string; status: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const COURSES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Sc', 'M.Sc'];

function toValues(s?: Student): Values {
  return {
    first_name: s?.first_name ?? '',
    last_name: s?.last_name ?? '',
    email: s?.email ?? '',
    phone: s?.phone ?? '',
    date_of_birth: s?.date_of_birth?.slice(0, 10) ?? '',
    gender: s?.gender ?? 'Male',
    course: s?.course ?? '',
    year: String(s?.year ?? 1),
    status: s?.status ?? 'Active',
  };
}

function validate(v: Values): Errors {
  const e: Errors = {};
  const len = (x: string) => x.trim().length;
  if (len(v.first_name) < 2 || len(v.first_name) > 50) e.first_name = 'Enter 2-50 characters.';
  if (len(v.last_name) < 2 || len(v.last_name) > 50) e.last_name = 'Enter 2-50 characters.';
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address.';
  if (v.phone && !/^\d{10}$/.test(v.phone)) e.phone = 'Phone must be exactly 10 digits.';
  if (!v.date_of_birth) e.date_of_birth = 'Choose a date of birth.';
  else {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 16);
    if (new Date(v.date_of_birth) > cutoff) e.date_of_birth = 'Student must be at least 16 years old.';
  }
  if (!len(v.course)) e.course = 'Enter or choose a course.';
  return e;
}

interface Props {
  initial?: Student;
  submitLabel: string;
  onSubmit: (data: StudentInput) => Promise<void>;
  serverError?: string;
}

export default function StudentForm({ initial, submitLabel, onSubmit, serverError }: Props) {
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
        date_of_birth: values.date_of_birth,
        gender: values.gender as StudentInput['gender'],
        course: values.course.trim(),
        year: Number(values.year),
        status: values.status as StudentInput['status'],
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose">
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" autoComplete="off" {...bind('first_name')} />
        <Input label="Last name" autoComplete="off" {...bind('last_name')} />
        <Input label="Email" type="email" autoComplete="off" {...bind('email')} />
        <Input label="Phone (optional)" inputMode="numeric" maxLength={10} hint="10-digit mobile number" {...bind('phone')} />
        <Input label="Date of birth" type="date" {...bind('date_of_birth')} />
        <Select label="Gender" {...bind('gender')}>
          <option>Male</option><option>Female</option><option>Other</option>
        </Select>
        <div>
          <Input label="Course" list="course-list" {...bind('course')} />
          <datalist id="course-list">{COURSES.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <Select label="Year of study" {...bind('year')}>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </Select>
        <Select label="Status" {...bind('status')}>
          <option>Active</option><option>Inactive</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
        <Link href="/dashboard">
          <Button type="button" variant="ghost">Cancel</Button>
        </Link>
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
}
