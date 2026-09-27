import type { KitchenSettingsData } from '@/lib/content'

const smsHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`
  const body = encodeURIComponent('Kitchen Order: [Your Name] - [Order Details]')
  return `sms:${e164}?body=${body}`
}

export function KitchenOrdering({ settings }: { settings: KitchenSettingsData }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">{settings.announcement}</p>
      </div>

      {settings.isOrderingActive ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            src={`https://form.jotform.com/${settings.jotformId}`}
            title="Kitchen order form"
            className="h-[900px] w-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">Online ordering is currently closed</p>
          <p className="mt-1 text-sm text-slate-500">
            Please text your order directly to the kitchen using the button below.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-700">Having issues with the form?</p>
        <a
          href={smsHref(settings.backupPhone)}
          className="mt-2 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Text order directly to {settings.backupPhone}
        </a>
      </div>
    </div>
  )
}
