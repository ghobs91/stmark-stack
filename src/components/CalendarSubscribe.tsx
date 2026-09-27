'use client'

import { useEffect, useState } from 'react'

export function CalendarSubscribe({ feedPath = '/api/calendar/feed.ics' }: { feedPath?: string }) {
  const [copied, setCopied] = useState(false)
  const [host, setHost] = useState('')

  useEffect(() => {
    setHost(window.location.host)
  }, [])

  const copy = async () => {
    try {
      const url = new URL(feedPath, window.location.origin).toString()
      await navigator.clipboard.writeText(url.replace(/^https?/, 'webcal'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access may be denied.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={host ? `webcal://${host}${feedPath}` : feedPath}
        className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Add to Apple Calendar
      </a>
      <a
        href={feedPath}
        download="stmark-schedule.ics"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Add to Google / Outlook (.ics)
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
      >
        {copied ? 'Copied!' : 'Copy feed link'}
      </button>
    </div>
  )
}
