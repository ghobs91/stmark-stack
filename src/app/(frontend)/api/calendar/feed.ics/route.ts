import { NextResponse } from 'next/server'

import { getAllUpcomingEvents } from '@/lib/content'
import { buildIcalFeed } from '@/lib/ical'

export const dynamic = 'force-dynamic'

export async function GET() {
  const events = await getAllUpcomingEvents()
  const body = buildIcalFeed(events)

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="stmark-schedule.ics"',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
