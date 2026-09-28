import type { Metadata } from 'next'

import { CalendarSubscribe } from '@/components/CalendarSubscribe'
import { EventsList } from '@/components/EventsList'
import { PageHeader } from '@/components/PageHeader'
import { Container } from '@/components/ui/Container'
import { getUpcomingEvents } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Liturgical Schedule',
  description: 'Upcoming liturgies, vespers, and church services at St. Mark.',
}

export default async function SchedulePage() {
  const events = await getUpcomingEvents(100)

  return (
    <div>
      <PageHeader
        eyebrow="Worship"
        title="Liturgical Schedule"
        description="Subscribe once and every new service is added to your phone automatically."
        action={<CalendarSubscribe />}
      />
      <Container className="py-10 sm:py-12">
        <EventsList events={events} />
      </Container>
    </div>
  )
}
