import Link from 'next/link'

import { BULLETIN_CATEGORY_LABELS, type BulletinData } from '@/lib/content'
import { formatDate } from '@/lib/format'

const CATEGORY_STYLES: Record<string, string> = {
  weekly: 'bg-brand/10 text-accent',
  condolence: 'bg-brand/10 text-muted',
  announcement: 'bg-gold/15 text-gold',
  feast: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
}

export function BulletinsList({ bulletins }: { bulletins: BulletinData[] }) {
  if (bulletins.length === 0) {
    return (
      <p className="rounded-lg border border-hair bg-surface p-6 text-sm text-subtle">
        No bulletins have been published yet.
      </p>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {bulletins.map((bulletin) => (
        <li key={bulletin.id}>
          <Link
            href={`/bulletins/${bulletin.id}`}
            className="group flex h-full flex-col rounded-xl border border-hair bg-surface p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  CATEGORY_STYLES[bulletin.category] ?? 'bg-brand/5 text-muted'
                }`}
              >
                {BULLETIN_CATEGORY_LABELS[bulletin.category] ?? bulletin.category}
              </span>
              {bulletin.isUrgent ? (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                  Urgent
                </span>
              ) : null}
              <span className="ml-auto text-xs text-subtle">
                {formatDate(bulletin.publishDate)}
              </span>
            </div>
            <h3 className="mt-3 font-serif text-lg leading-snug text-ink transition group-hover:text-accent">
              {bulletin.title}
            </h3>
            <div className="mt-auto pt-3">
              {bulletin.pdfUrl ? (
                <span className="text-xs font-medium text-gold">PDF bulletin attached →</span>
              ) : (
                <span className="text-xs font-medium text-subtle">Read →</span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
