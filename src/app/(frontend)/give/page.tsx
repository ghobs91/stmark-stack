import type { Metadata } from 'next'

import { DonationModal } from '@/components/DonationModal'
import { PageHeader } from '@/components/PageHeader'
import { Container } from '@/components/ui/Container'
import { DONATION_FUNDS } from '@/lib/donation-funds'

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support the ministry of St. Mark Coptic Orthodox Center.',
}

type Args = {
  searchParams: Promise<{ donation?: string }>
}

export default async function GivePage({ searchParams }: Args) {
  const { donation } = await searchParams

  return (
    <div>
      <PageHeader
        eyebrow="Stewardship"
        title="Give"
        description="Your generosity supports our worship, building, and kitchen ministries."
      />
      <Container className="py-10 sm:py-12">
        {donation === 'success' ? (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200">
            Thank you for your gift. May God reward your generosity.
          </div>
        ) : null}
        {donation === 'cancelled' ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
            Your donation was cancelled. You can try again at any time.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
          <div className="rounded-xl border border-hair bg-surface p-6">
            <p className="eyebrow">Allocation funds</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {DONATION_FUNDS.map((fund) => (
                <li key={fund.value} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {fund.label}
                </li>
              ))}
            </ul>
            <div className="mt-6 rule-gold w-16" />
            <p className="mt-4 text-xs text-subtle">
              Prefer to give by text? Text &ldquo;Build&rdquo; to (516) 246-5959.
            </p>
          </div>

          <div className="rounded-xl border border-hair bg-surface p-6">
            <p className="eyebrow">Secure giving</p>
            <p className="mt-3 text-sm text-muted">
              Give securely by card. One-time gifts and monthly giving are both available.
            </p>
            <div className="mt-5">
              <DonationModal />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
