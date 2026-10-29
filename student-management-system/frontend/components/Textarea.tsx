import { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function Textarea({ label, error, hint, id, className = '', ...rest }: Props) {
  const fieldId = id ?? rest.name;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">{label}</label>
      <textarea
        id={fieldId}
        rows={3}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-500/60 ${error ? 'border-rose' : 'border-ink-200 hover:border-ink-500'}`}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose">{error}</p>}
    </div>
  );
}
