import type { Metadata } from 'next'

import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Offline',
}

export default function OfflinePage() {
  return (
    <Container className="py-20 text-center">
      <p className="eyebrow">Offline</p>
      <h1 className="mt-2 text-3xl text-ink">You&apos;re offline</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        We couldn&apos;t reach the St. Mark site. Cached bulletins and schedules are still available
        from the pages you have visited.
      </p>
      <p className="mt-8 text-sm text-muted">
        Need to place a kitchen order right now? Text the kitchen directly:
      </p>
      <a
        href="sms:+15164584941?body=Kitchen%20Order:%20[Your%20Name]%20-%20[Order%20Details]"
        className="mt-3 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        Text order to (516) 458-4941
      </a>
    </Container>
  )
}
