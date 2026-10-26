import { forwardRef, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

const fieldClass = (error?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-500/60 transition-colors ${
    error ? 'border-rose' : 'border-ink-200 hover:border-ink-500'
  }`;

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  function Input({ label, error, hint, rightSlot, id, className = '', ...rest }, ref) {
    const fieldId = id ?? rest.name;
    return (
      <div className={className}>
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={`${fieldClass(error)} ${rightSlot ? 'pr-16' : ''}`}
            {...rest}
          />
          {rightSlot && <div className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</div>}
        </div>
        {hint && !error && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
        {error && (
          <p id={`${fieldId}-error`} className="mt-1 text-xs font-medium text-rose">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export function Select({
  label,
  error,
  id,
  className = '',
  children,
  ...rest
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const fieldId = id ?? rest.name;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select id={fieldId} aria-invalid={!!error} className={fieldClass(error)} {...rest}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-rose">{error}</p>}
    </div>
  );
}
