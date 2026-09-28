import Link from 'next/link'

import type { KitchenSettingsData } from '@/lib/content'

const smsHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`
  const body = encodeURIComponent('Kitchen Order: [Your Name] - [Order Details]')
  return `sms:${e164}?body=${body}`
}

export function KitchenOrdering({
  settings,
  variant = 'full',
}: {
  settings: KitchenSettingsData
  variant?: 'full' | 'teaser'
}) {
  if (variant === 'teaser') {
    return (
      <div className="grid items-center gap-6 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-muted">{settings.announcement}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kitchen"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              Open order form
            </Link>
            <a
              href={smsHref(settings.backupPhone)}
              className="rounded-lg border border-hair bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-gold"
            >
              Text {settings.backupPhone}
            </a>
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-surface/70 p-4 dark:border-amber-500/20">
          <p className="eyebrow">Pickup</p>
          <p className="mt-1 text-sm text-muted">
            Saturdays &amp; Sundays after liturgy. Order online, or text us if the form gives you
            trouble.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
        <span className="font-medium">Note:</span> {settings.announcement}
      </div>

      {settings.isOrderingActive ? (
        <div className="overflow-hidden rounded-xl border border-hair bg-surface shadow-sm">
          <iframe
            src={`https://form.jotform.com/${settings.jotformId}`}
            title="Kitchen order form"
            className="h-[900px] w-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-hair bg-surface p-8 text-center shadow-sm">
          <p className="font-serif text-xl text-ink">Online ordering is currently closed</p>
          <p className="mt-1 text-sm text-subtle">
            Please text your order directly to the kitchen using the button below.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hair bg-surface px-4 py-3 shadow-sm">
        <p className="text-sm text-muted">
          Having issues with the form? Text your full order and name to the kitchen.
        </p>
        <a
          href={smsHref(settings.backupPhone)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          Text {settings.backupPhone}
        </a>
      </div>
    </div>
  )
}
