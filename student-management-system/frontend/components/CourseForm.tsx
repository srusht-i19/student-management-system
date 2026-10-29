'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import type { Course, CourseInput } from '@/types/course';
import Button from './Button';
import { Input, Select } from './Input';
import Textarea from './Textarea';

type Values = { code: string; name: string; duration_years: string; description: string; status: string };
type Errors = Partial<Record<keyof Values, string>>;

const toValues = (c?: Course): Values => ({
  code: c?.code ?? '',
  name: c?.name ?? '',
  duration_years: String(c?.duration_years ?? 3),
  description: c?.description ?? '',
  status: c?.status ?? 'Active',
});

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!/^[A-Za-z0-9_-]{2,20}$/.test(v.code.trim())) e.code = 'Use 2-20 letters, numbers, - or _.';
  const n = v.name.trim().length;
  if (n < 2 || n > 100) e.name = 'Enter 2-100 characters.';
  if (v.description.trim().length > 500) e.description = 'At most 500 characters.';
  return e;
}

interface Props {
  initial?: Course;
  submitLabel: string;
  onSubmit: (data: CourseInput) => Promise<void>;
  serverError?: string;
}

export default function CourseForm({ initial, submitLabel, onSubmit, serverError }: Props) {
  const [values, setValues] = useState<Values>(toValues(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const bind = (name: keyof Values) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
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
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        duration_years: Number(values.duration_years),
        description: values.description.trim(),
        status: values.status as CourseInput['status'],
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
        <Input label="Course code" hint="Short and unique, e.g. BTECH" autoComplete="off" {...bind('code')} />
        <Input label="Course name" autoComplete="off" {...bind('name')} />
        <Select label="Duration" {...bind('duration_years')}>
          {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>)}
        </Select>
        <Select label="Status" {...bind('status')}>
          <option>Active</option><option>Inactive</option>
        </Select>
      </div>
      <Textarea label="Description (optional)" {...bind('description')} />
      <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
        <Link href="/dashboard/courses"><Button type="button" variant="ghost">Cancel</Button></Link>
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
}
