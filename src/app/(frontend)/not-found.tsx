import Link from 'next/link'

import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl text-ink">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try the schedule or the
        latest news.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          Go home
        </Link>
        <Link
          href="/schedule"
          className="rounded-lg border border-hair bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-gold"
        >
          View schedule
        </Link>
      </div>
    </Container>
  )
}
