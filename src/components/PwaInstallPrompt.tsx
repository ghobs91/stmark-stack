'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(true)

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handler = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isStandalone || dismissed || !deferredPrompt) return null

  const install = async () => {
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="text-sm font-medium text-slate-800">Install the St. Mark app</p>
      <p className="mt-1 text-xs text-slate-500">
        Add us to your home screen for quick access to schedules, bulletins, and the kitchen.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={install}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
