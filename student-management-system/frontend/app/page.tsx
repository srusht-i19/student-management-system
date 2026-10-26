import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

const REGISTER = [
  { name: 'Aarav Patil', course: 'B.Tech', year: 2, active: true, tone: 'bg-ink text-white' },
  { name: 'Meera Joshi', course: 'MCA', year: 1, active: true, tone: 'bg-gold text-ink' },
  { name: 'Rohan Kulkarni', course: 'BCA', year: 3, active: false, tone: 'bg-mint text-white' },
  { name: 'Sana Shaikh', course: 'B.Sc', year: 4, active: true, tone: 'bg-ink-500 text-white' },
];

const FEATURES = [
  {
    title: 'Manage Students',
    text: 'Add a student, fix a typo or remove a record in a few clicks. Every field is checked before it is saved.',
    card: 'bg-ink text-white',
    sub: 'text-ink-200',
    icon: 'M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0',
  },
  {
    title: 'Track Courses',
    text: 'See who is in B.Tech, BCA or MCA and which year they are in. Search by name, email or course.',
    card: 'bg-gold text-ink',
    sub: 'text-ink/75',
    icon: 'M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5ZM8 9h6M8 13h4',
  },
  {
    title: 'Secure Access',
    text: 'Only signed-in admins can open the student list. Sessions expire after a day.',
    card: 'bg-mint-50 text-ink ring-1 ring-mint/30',
    sub: 'text-ink-500',
    icon: 'M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z',
  },
];

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Every student, one clear register.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-500">
              Add, find and update student records in seconds, without spreadsheets or paper files.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button variant="accent" className="!px-6 !py-3 !text-base">Get Started</Button>
              </Link>
              <a href="#features">
                <Button variant="ghost" className="!px-6 !py-3 !text-base">See features</Button>
              </a>
            </div>
          </div>

          {/* The memorable element: a register being called out row by row. */}
          <div className="relative">
            <div className="absolute -inset-3 -rotate-2 rounded-3xl bg-gold" aria-hidden />
            <div className="relative rotate-1 rounded-2xl bg-white p-5 shadow-lift sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-lg font-bold">Class register</p>
                <p className="text-sm text-ink-500">4 of 128 students</p>
              </div>
              <ul className="divide-y divide-ink-100">
                {REGISTER.map((r, i) => (
                  <li key={r.name} className="roll-call flex items-center gap-3 py-3" style={{ animationDelay: `${0.25 + i * 0.18}s` }}>
                    <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${r.tone}`}>
                      {r.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{r.name}</p>
                      <p className="text-sm text-ink-500">{r.course}, Year {r.year}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.active ? 'bg-mint-50 text-mint-700' : 'bg-ink-100 text-ink-500'}`}>
                      {r.active ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-24 sm:px-6">
          <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the admin office, not for IT.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className={`rounded-2xl p-7 ${f.card}`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={f.icon} />
                </svg>
                <h3 className="mt-6 text-xl font-bold">{f.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${f.sub}`}>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
