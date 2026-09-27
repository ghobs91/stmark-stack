import { formatCopticDate, type DailyReadings } from '@/lib/katameros'

export function DailyReadingsBanner({ readings }: { readings: DailyReadings }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
          Today&apos;s Readings
        </h2>
        <span className="text-xs text-slate-400">{formatCopticDate(readings.coptic)}</span>
      </div>
      <blockquote className="mt-3 text-lg font-medium text-slate-800">
        &ldquo;{readings.verse}&rdquo;
      </blockquote>
      {readings.verseReference ? (
        <p className="mt-2 text-sm text-slate-500">— {readings.verseReference}</p>
      ) : null}
      {readings.saints.length > 0 ? (
        <p className="mt-3 text-sm text-slate-600">
          <span className="font-medium">Commemorated today:</span> {readings.saints.join(', ')}
        </p>
      ) : null}
    </section>
  )
}
