import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
}

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900">You&apos;re offline</h1>
      <p className="mt-3 text-sm text-slate-600">
        We couldn&apos;t reach the St. Mark site. Cached bulletins and schedules are still
        available from the pages you have visited.
      </p>
      <p className="mt-6 text-sm text-slate-600">
        Need to place a kitchen order right now? Text the kitchen directly:
      </p>
      <a
        href="sms:+15164584941?body=Kitchen%20Order:%20[Your%20Name]%20-%20[Order%20Details]"
        className="mt-3 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
      >
        Text order to (516) 458-4941
      </a>
    </div>
  )
}
