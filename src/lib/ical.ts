export type CalendarEvent = {
  id: number | string
  title: string
  startTime: string
  endTime: string
  description?: string | null
  location?: string | null
}

const escapeText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

const toIcsDate = (value: string) =>
  new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const foldLine = (line: string) => {
  if (line.length <= 75) return line
  const chunks: string[] = []
  let current = line
  while (current.length > 75) {
    chunks.push(current.slice(0, 75))
    current = ` ${current.slice(75)}`
  }
  chunks.push(current)
  return chunks.join('\r\n')
}

/**
 * Builds an RFC 5545 iCalendar document from a list of Payload events.
 */
export function buildIcalFeed(events: CalendarEvent[], calendarName = 'St. Mark Church Calendar') {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//St. Mark Coptic Orthodox Center//Schedules//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
  ]

  for (const event of events) {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:event-${event.id}@saintmarkcenter.org`)
    lines.push(`DTSTAMP:${toIcsDate(new Date().toISOString())}`)
    lines.push(`DTSTART:${toIcsDate(event.startTime)}`)
    lines.push(`DTEND:${toIcsDate(event.endTime)}`)
    lines.push(foldLine(`SUMMARY:${escapeText(event.title)}`))
    if (event.location) lines.push(foldLine(`LOCATION:${escapeText(event.location)}`))
    if (event.description) lines.push(foldLine(`DESCRIPTION:${escapeText(event.description)}`))
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return `${lines.join('\r\n')}\r\n`
}

export const googleCalendarUrl = (event: CalendarEvent) => {
  const start = toIcsDate(event.startTime)
  const end = toIcsDate(event.endTime)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? '',
    location: event.location ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
