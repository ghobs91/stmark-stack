import Link from 'next/link'

import { Container } from './ui/Container'

export function Footer({ contactPhone = '(516) 367-1328' }: { contactPhone?: string }) {
  return (
    <footer className="mt-auto bg-brand-dark text-slate-300">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-white">St. Mark Coptic Orthodox Center</p>
          <p className="mt-2 text-sm text-subtle">
            90 Woodbury Rd
            <br />
            Woodbury, NY 11797
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ['/schedule', 'Liturgical Schedule'],
              ['/bulletins', 'News & Bulletins'],
              ['/kitchen', 'Kitchen Service'],
              ['/give', 'Online Giving'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-slate-300 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                {contactPhone}
              </a>
            </li>
            <li>
              <a href="mailto:StAbraam@Gmail.com" className="hover:text-white">
                StAbraam@Gmail.com
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-xs text-subtle">
          &copy; {new Date().getFullYear()} St. Mark Coptic Orthodox Center. All rights reserved.
        </Container>
      </div>
    </footer>
  )
}
