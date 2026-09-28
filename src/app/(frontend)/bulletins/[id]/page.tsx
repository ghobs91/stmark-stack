import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

import { Container } from '@/components/ui/Container'
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
    <Container className="py-10 sm:py-14">
      <Link href="/bulletins" className="text-sm text-gold transition hover:text-ink">
        ← Back to news
      </Link>

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-medium text-gold">
            {BULLETIN_CATEGORY_LABELS[bulletin.category] ?? bulletin.category}
          </span>
          <span className="text-xs text-subtle">{formatLongDate(bulletin.publishDate)}</span>
        </div>

        <h1 className="mt-3 text-3xl text-ink sm:text-4xl">{bulletin.title}</h1>
        <div className="mt-4 rule-gold w-24" />

        {bulletin.pdfUrl ? (
          <a
            href={bulletin.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            Download PDF bulletin
          </a>
        ) : null}

        {bulletin.content ? (
          <div className="prose prose-slate mt-8 max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-gold">
            <RichText data={bulletin.content as Parameters<typeof RichText>[0]['data']} />
          </div>
        ) : null}
      </article>
    </Container>
  )
}
