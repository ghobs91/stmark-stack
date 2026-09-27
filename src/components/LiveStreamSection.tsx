'use client'

import { useState } from 'react'

import { youtubeEmbedUrl, youtubeWatchUrl, type ArchivedVideo, type LiveStatus } from '@/lib/youtube'
import { formatDate } from '@/lib/format'

export function LiveStreamSection({
  live,
  videos,
}: {
  live: LiveStatus
  videos: ArchivedVideo[]
}) {
  const [playing, setPlaying] = useState(false)

  if (live.isLive && live.videoId) {
    return (
      <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="animate-live inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              Live
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{live.title ?? 'Live now'}</p>
              {live.channelTitle ? (
                <p className="text-xs text-slate-500">{live.channelTitle}</p>
              ) : null}
            </div>
          </div>
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Watch live
            </button>
          ) : null}
        </div>
        {playing ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              className="h-full w-full"
              src={youtubeEmbedUrl(live.videoId)}
              title="Live stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={youtubeWatchUrl(live.videoId)}
            className="block aspect-video w-full bg-slate-900 bg-cover bg-center"
            style={live.thumbnail ? { backgroundImage: `url(${live.thumbnail})` } : undefined}
            aria-label="Watch the live stream on YouTube"
          />
        )}
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
          Latest Liturgies &amp; Sermons
        </h2>
      </div>
      {videos.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No live stream is active right now. Recent recordings will appear here after the next
          service.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.videoId}>
              <a
                href={youtubeWatchUrl(video.videoId)}
                className="group block overflow-hidden rounded-xl border border-slate-200 transition hover:border-brand"
              >
                {video.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail}
                    alt=""
                    width={480}
                    height={270}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full bg-slate-100" />
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-brand">
                    {video.title}
                  </p>
                  {video.publishedAt ? (
                    <p className="mt-1 text-xs text-slate-400">{formatDate(video.publishedAt, 'UTC')}</p>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
