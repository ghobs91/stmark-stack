'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/bulletins', label: 'News' },
  { href: '/kitchen', label: 'Kitchen' },
  { href: '/give', label: 'Give' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="-mb-px flex items-center gap-0.5 overflow-x-auto text-sm">
      {LINKS.map((link) => {
        const active =
          link.href === '/' ? pathname === '/' : pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap border-b-2 px-3 py-2 transition ${
              active
                ? 'border-gold font-medium text-ink'
                : 'border-transparent text-subtle hover:border-hair hover:text-ink'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
      <Link
        href="/admin"
        className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-subtle hover:text-ink"
      >
        Admin
      </Link>
    </nav>
  )
}
