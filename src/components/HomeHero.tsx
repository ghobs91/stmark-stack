import Link from 'next/link'

import { Container } from './ui/Container'

type IconName = 'schedule' | 'kitchen' | 'give'

const ICONS: Record<IconName, React.ReactNode> = {
  schedule: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4M8 14h3" />
    </>
  ),
  kitchen: (
    <>
      <path d="M4 10h16M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M6 10v9M18 10v9M10 4V2.5M14 4V2.5" />
    </>
  ),
  give: (
    <>
      <path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />
    </>
  ),
}

const ACTIONS: { href: string; label: string; description: string; icon: IconName }[] = [
  { href: '/schedule', label: 'Schedule', description: 'Liturgies & services', icon: 'schedule' },
  { href: '/kitchen', label: 'Kitchen', description: 'Order for pickup', icon: 'kitchen' },
  { href: '/give', label: 'Give', description: 'Support the church', icon: 'give' },
]

export function HomeHero({
  churchName,
  tagline,
  address,
  announcement,
}: {
  churchName: string
  tagline: string
  address: string
  announcement: string
}) {
  return (
    <section id="top" className="relative scroll-mt-20 overflow-hidden bg-brand-dark text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(181,138,60,0.2),transparent_55%)]" />
      <Container className="relative py-16 sm:py-24">
        <p className="eyebrow">{tagline}</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
          {churchName}
        </h1>
        {address ? <p className="mt-3 text-sm text-slate-400">{address}</p> : null}
        {announcement ? (
          <p className="mt-6 max-w-2xl border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-slate-300">
            {announcement}
          </p>
        ) : null}

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/10"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-brand-dark">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  {ICONS[action.icon]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-lg leading-tight text-white">
                  {action.label}
                </span>
                <span className="block text-xs text-slate-400">{action.description}</span>
              </span>
              <span className="ml-auto text-lg text-gold opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
