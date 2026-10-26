import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-ink text-ink-200">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
        <Logo light />
        <p className="text-sm">&copy; {new Date().getFullYear()} Rollbook Student Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}
