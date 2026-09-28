import type { ReactNode } from 'react'

import { Container } from './ui/Container'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="border-b border-hair bg-parchment">
      <Container className="flex flex-wrap items-end justify-between gap-4 py-10 sm:py-12">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-1 text-3xl text-ink sm:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </Container>
    </div>
  )
}
