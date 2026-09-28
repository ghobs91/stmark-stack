import { formatCopticDate, type DailyReadings } from '@/lib/katameros'

export function DailyReadingsBanner({ readings }: { readings: DailyReadings }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[1px_1fr] sm:gap-8">
      <span className="hidden w-px self-stretch bg-gradient-to-b from-gold via-gold/40 to-transparent sm:block" />
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow">Today&apos;s Readings</p>
          <span className="text-xs font-medium uppercase tracking-wider text-subtle">
            {formatCopticDate(readings.coptic)}
          </span>
        </div>
        <blockquote className="mt-4 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
          &ldquo;{readings.verse}&rdquo;
        </blockquote>
        {readings.verseReference ? (
          <p className="mt-3 text-sm font-medium text-gold">— {readings.verseReference}</p>
        ) : null}
        {readings.saints.length > 0 ? (
          <p className="mt-4 text-sm text-muted">
            <span className="font-medium text-ink">Commemorated today:</span>{' '}
            {readings.saints.join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}
