import type { ReactNode } from 'react'

import { Container } from './Container'

const TONES = {
  plain: '',
  white: 'bg-surface border-y border-hair',
  parchment: 'bg-parchment border-y border-hair',
  warm: 'bg-warm border-y border-hair',
  night: 'bg-brand-dark text-slate-200',
  charcoal: 'bg-charcoal text-slate-200',
} as const

export function Section({
  tone = 'plain',
  id,
  className = '',
  children,
}: {
  tone?: keyof typeof TONES
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-12 sm:py-16 ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}
