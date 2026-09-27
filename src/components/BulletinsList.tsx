import Link from 'next/link'

import { BULLETIN_CATEGORY_LABELS, type BulletinData } from '@/lib/content'
import { formatDate } from '@/lib/format'

export function BulletinsList({ bulletins }: { bulletins: BulletinData[] }) {
  if (bulletins.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        No bulletins have been published yet.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {bulletins.map((bulletin) => (
        <li key={bulletin.id}>
          <Link
            href={`/bulletins/${bulletin.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {BULLETIN_CATEGORY_LABELS[bulletin.category] ?? bulletin.category}
              </span>
              {bulletin.isUrgent ? (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                  Urgent
                </span>
              ) : null}
              <span className="text-xs text-slate-400">{formatDate(bulletin.publishDate)}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-800">{bulletin.title}</h3>
            {bulletin.pdfUrl ? (
              <p className="mt-2 text-xs font-medium text-brand">PDF bulletin attached</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}
