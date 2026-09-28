'use client'

import { useEffect, useState } from 'react'

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i += 1) output[i] = rawData.charCodeAt(i)
  return output
}

export function PushNotificationToggle({ enabled = true }: { enabled?: boolean }) {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window)
    navigator.serviceWorker?.ready
      .then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription()
        setSubscribed(Boolean(subscription))
      })
      .catch(() => setSubscribed(false))
  }, [])

  if (!enabled || !supported) return null

  const subscribe = async () => {
    setBusy(true)
    setError(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError('Notifications were not permitted.')
        return
      }
      const keyRes = await fetch('/api/push/vapid-public-key')
      const { publicKey } = (await keyRes.json()) as { publicKey?: string }
      if (!publicKey) {
        setError('Push notifications are not configured yet.')
        return
      }
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })
      setSubscribed(true)
    } catch {
      setError('Could not enable notifications.')
    } finally {
      setBusy(false)
    }
  }

  const unsubscribe = async () => {
    setBusy(true)
    setError(null)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        await subscription.unsubscribe()
      }
      setSubscribed(false)
    } catch {
      setError('Could not disable notifications.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hair bg-surface px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/5 text-gold">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M10 18a2 2 0 0 0 4 0"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Push notifications</p>
          <p className="text-xs text-subtle">
            Urgent alerts like Holy Week schedule changes.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
        <button
          type="button"
          onClick={subscribed ? unsubscribe : subscribe}
          disabled={busy}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
            subscribed
              ? 'border border-hair text-muted hover:border-gold'
              : 'bg-brand text-white hover:bg-brand-dark'
          }`}
        >
          {busy ? 'Working…' : subscribed ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
