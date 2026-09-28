import { EVENT_TYPE_LABELS, type EventData } from '@/lib/content'
import { formatTime, TIME_ZONE } from '@/lib/format'
import { googleCalendarUrl } from '@/lib/ical'

const dayFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: TIME_ZONE })
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: TIME_ZONE })

export function EventsList({ events }: { events: EventData[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-hair bg-surface p-6 text-sm text-subtle">
        No upcoming services are scheduled yet. Please check back soon.
      </p>
    )
  }

  return (
    <ol>
      {events.map((event) => (
        <li key={event.id} className="grid grid-cols-[4.25rem_1fr] gap-4 sm:grid-cols-[5rem_1fr]">
          <div className="pt-3 text-right">
            <p className="font-serif text-2xl leading-none text-ink">
              {dayFormat.format(new Date(event.startTime))}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-subtle">
              {monthFormat.format(new Date(event.startTime))}
            </p>
          </div>

          <div className="relative border-l border-hair pb-7 pl-5">
            <span className="absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full bg-gold" />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="rounded-full bg-brand/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-accent">
                {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
              </span>
              <span className="text-xs text-subtle">
                {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-semibold text-ink">{event.title}</h3>
            {event.location ? (
              <p className="text-sm text-subtle">{event.location}</p>
            ) : null}
            {event.description ? (
              <p className="mt-1 text-sm text-muted">{event.description}</p>
            ) : null}
            <a
              href={googleCalendarUrl({
                id: event.id,
                title: event.title,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description,
                location: event.location,
              })}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-block text-xs font-medium text-gold transition hover:text-ink"
            >
              Add to Google Calendar
            </a>
          </div>
        </li>
      ))}
    </ol>
  )
}
