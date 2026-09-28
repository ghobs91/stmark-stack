'use client'

import { useState } from 'react'

import { youtubeEmbedUrl, youtubeWatchUrl, type ArchivedVideo, type LiveStatus } from '@/lib/youtube'
import { formatDate } from '@/lib/format'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'

export function LiveStreamSection({
  live,
  videos,
  id,
}: {
  live: LiveStatus
  videos: ArchivedVideo[]
  id?: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <Section id={id} tone="charcoal">
      <SectionHeading
        invert
        eyebrow="Live Broadcast"
        title={live.isLive ? 'We are live now' : 'Recent liturgies & sermons'}
        action={
          <a
            href="https://www.youtube.com/@st.abraammedia/streams"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gold-soft transition hover:text-white"
          >
            YouTube channel ↗
          </a>
        }
      />

      {live.isLive && live.videoId ? (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          {playing ? (
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={youtubeEmbedUrl(live.videoId)}
                title="Live stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full"
            >
              {live.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={live.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:opacity-80"
                />
              ) : (
                <span className="absolute inset-0 bg-slate-900" />
              )}
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                <span className="animate-live h-1.5 w-1.5 rounded-full bg-surface" />
                Live
              </span>
              <span className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-ink shadow-lg">
                  Watch live
                </span>
              </span>
            </button>
          )}
          {live.title ? (
            <p className="border-t border-white/10 px-4 py-3 text-sm text-slate-300">{live.title}</p>
          ) : null}
        </div>
      ) : videos.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <li key={video.videoId}>
              <a
                href={youtubeWatchUrl(video.videoId)}
                className="group block overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-gold/60"
              >
                {video.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="aspect-video w-full object-cover opacity-90 transition group-hover:opacity-100"
                  />
                ) : (
                  <div className="aspect-video w-full bg-slate-800" />
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm text-slate-200 transition group-hover:text-white">
                    {video.title}
                  </p>
                  {video.publishedAt ? (
                    <p className="mt-1 text-xs text-subtle">
                      {formatDate(video.publishedAt, 'UTC')}
                    </p>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-subtle">
          No live stream is active right now. Recent recordings will appear here after the next
          service.
        </p>
      )}
    </Section>
  )
}
