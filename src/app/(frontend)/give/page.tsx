import type { Metadata } from 'next'

import { DonationModal } from '@/components/DonationModal'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Give</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your generosity supports our worship, building, and kitchen ministries.
        </p>
      </div>

      {donation === 'success' ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Thank you for your gift. May God reward your generosity.
        </div>
      ) : null}
      {donation === 'cancelled' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your donation was cancelled. You can try again at any time.
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Allocation funds</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {DONATION_FUNDS.map((fund) => (
              <li key={fund.value} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {fund.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Give securely with a card. One-time gifts and monthly giving are both available.
          </p>
          <DonationModal />
        </div>
      </div>
    </div>
  )
}
