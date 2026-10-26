import { ButtonHTMLAttributes, forwardRef } from 'react';
import Spinner from './Spinner';

type Variant = 'primary' | 'accent' | 'ghost' | 'danger';

const styles: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-700',
  accent: 'bg-gold text-ink hover:bg-gold-600',
  ghost: 'bg-white text-ink ring-1 ring-ink-200 hover:bg-ink-100',
  danger: 'bg-rose text-white hover:bg-[#b93842]',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', loading = false, className = '', children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
});

export default Button;
