import type { Metadata } from 'next'

import { CalendarSubscribe } from '@/components/CalendarSubscribe'
import { EventsList } from '@/components/EventsList'
import { getUpcomingEvents } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Liturgical Schedule',
  description: 'Upcoming liturgies, vespers, and church services at St. Mark.',
}

export default async function SchedulePage() {
  const events = await getUpcomingEvents(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Liturgical Schedule</h1>
        <p className="mt-1 text-sm text-slate-500">
          Subscribe once and every new service is added to your phone automatically.
        </p>
      </div>

      <CalendarSubscribe />

      <EventsList events={events} />
    </div>
  )
}
