interface Props {
  label: string;
  field?: string; // omit for columns that cannot be sorted
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
  onSort?: (field: string) => void;
  className?: string;
}

export default function SortableTh({ label, field, sortBy, sortOrder, onSort, className = '' }: Props) {
  const base = `px-5 py-3 font-semibold ${className}`;
  if (!field || !onSort) return <th className={base}>{label}</th>;
  const active = sortBy === field;
  return (
    <th className={base} aria-sort={active ? (sortOrder === 'ASC' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 hover:text-ink">
        {label}
        <span className={active ? 'text-ink' : 'text-ink-200'} aria-hidden>
          {active ? (sortOrder === 'ASC' ? '▲' : '▼') : '▲'}
        </span>
      </button>
    </th>
  );
}
