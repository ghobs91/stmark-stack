import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/bulletins', label: 'News' },
  { href: '/kitchen', label: 'Kitchen' },
  { href: '/give', label: 'Give' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192x192.png"
            alt=""
            width={28}
            height={28}
            className="rounded"
          />
          <span className="hidden sm:inline">St. Mark Coptic Orthodox Center</span>
          <span className="sm:hidden">St. Mark</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded px-3 py-1.5 text-slate-400 transition hover:text-brand"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
