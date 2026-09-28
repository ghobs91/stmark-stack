import Link from 'next/link'

import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'
import { Container } from './ui/Container'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-cream/85 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-2.5">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192x192.png"
            alt=""
            width={38}
            height={38}
            className="h-9 w-9 rounded-md ring-1 ring-hair"
          />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-ink">St. Mark</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-subtle">
              Coptic Orthodox Center
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLinks />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
