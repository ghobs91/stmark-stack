import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { BULLETIN_CATEGORY_LABELS, getBulletinById } from '@/lib/content'
import { formatLongDate } from '@/lib/format'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { id } = await params
  const bulletin = await getBulletinById(id)
  return { title: bulletin?.title ?? 'Bulletin' }
}

export default async function BulletinPage({ params }: Args) {
  const { id } = await params
  const bulletin = await getBulletinById(id)

  if (!bulletin) notFound()

  return (
    <article className="space-y-6">
      <Link href="/bulletins" className="text-sm text-brand hover:underline">
        ← Back to news
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {BULLETIN_CATEGORY_LABELS[bulletin.category] ?? bulletin.category}
          </span>
          <span className="text-xs text-slate-400">{formatLongDate(bulletin.publishDate)}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{bulletin.title}</h1>
      </header>

      {bulletin.pdfUrl ? (
        <a
          href={bulletin.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Download PDF bulletin
        </a>
      ) : null}

      {bulletin.content ? (
        <div className="prose prose-slate max-w-none">
          <RichText data={bulletin.content as Parameters<typeof RichText>[0]['data']} />
        </div>
      ) : null}
    </article>
  )
}
