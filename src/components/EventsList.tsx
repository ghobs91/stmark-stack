import { EVENT_TYPE_LABELS, type EventData } from '@/lib/content'
import { formatDateTime, formatTime } from '@/lib/format'
import { googleCalendarUrl } from '@/lib/ical'

export function EventsList({ events }: { events: EventData[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        No upcoming services are scheduled yet. Please check back soon.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
              </p>
              <h3 className="mt-1 text-base font-semibold text-slate-800">{event.title}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {formatDateTime(event.startTime)} – {formatTime(event.endTime)}
              </p>
              {event.location ? (
                <p className="mt-1 text-sm text-slate-500">{event.location}</p>
              ) : null}
              {event.description ? (
                <p className="mt-2 text-sm text-slate-600">{event.description}</p>
              ) : null}
            </div>
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
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Add to Google
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
