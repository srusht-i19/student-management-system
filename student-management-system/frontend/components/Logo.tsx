import Link from 'next/link';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" stroke="#101D42" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 9h6M9 13h4" stroke="#101D42" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Rollbook
      </span>
    </Link>
  );
}
