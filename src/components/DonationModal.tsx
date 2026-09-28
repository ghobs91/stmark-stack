'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'

import {
  DONATION_FUNDS,
  MAX_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
  type DonationFund,
} from '@/lib/donation-funds'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

type Frequency = 'once' | 'monthly'

function PaymentForm({ amountLabel, onDone }: { amountLabel: string; onDone: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/give?donation=success` },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment could not be completed.')
      setSubmitting(false)
    } else {
      onDone()
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {submitting ? 'Processing…' : `Give ${amountLabel}`}
      </button>
    </form>
  )
}

export function DonationModal() {
  const [open, setOpen] = useState(false)
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [frequency, setFrequency] = useState<Frequency>('once')
  const [amount, setAmount] = useState(50)
  const [fund, setFund] = useState<DonationFund>('general')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (publishableKey) setStripePromise(loadStripe(publishableKey))
  }, [])

  if (!publishableKey) {
    return (
      <div className="rounded-2xl border border-hair bg-surface p-6 text-sm text-muted shadow-sm">
        Online giving is being set up. Please contact the church office to make a gift at this time.
      </div>
    )
  }

  const amountValid = amount >= MIN_DONATION_AMOUNT && amount <= MAX_DONATION_AMOUNT

  const close = () => {
    setOpen(false)
    setClientSecret(null)
    setError(null)
  }

  const start = async () => {
    setError(null)
    if (!amountValid) {
      setError(`Enter an amount between $${MIN_DONATION_AMOUNT} and $${MAX_DONATION_AMOUNT}.`)
      return
    }
    setLoading(true)
    try {
      const amountCents = Math.round(amount * 100)

      if (frequency === 'monthly') {
        const res = await fetch('/api/donations/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountCents, fund }),
        })
        const data = (await res.json()) as { url?: string; error?: string }
        if (res.ok && data.url) {
          window.location.href = data.url
          return
        }
        throw new Error(data.error || 'Could not start checkout.')
      }

      const res = await fetch('/api/donations/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents, fund }),
      })
      const data = (await res.json()) as { clientSecret?: string; error?: string }
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || 'Could not start payment.')
      }
      setClientSecret(data.clientSecret)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Give Online
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Give to St. Mark</h2>
              <button
                type="button"
                onClick={close}
                className="text-xl leading-none text-subtle hover:text-muted"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {clientSecret ? (
              <div className="mt-4">
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: 'stripe' } }}
                >
                  <PaymentForm amountLabel={`$${amount}`} onDone={close} />
                </Elements>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  {(['once', 'monthly'] as Frequency[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFrequency(value)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                        frequency === value
                          ? 'border-brand bg-brand text-white'
                          : 'border-hair text-muted hover:bg-brand/5'
                      }`}
                    >
                      {value === 'once' ? 'One-time' : 'Monthly'}
                    </button>
                  ))}
                </div>

                <label className="block text-sm">
                  <span className="text-muted">Amount (USD)</span>
                  <input
                    type="number"
                    min={MIN_DONATION_AMOUNT}
                    max={MAX_DONATION_AMOUNT}
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-hair px-3 py-2"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {[25, 50, 100, 250].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="rounded-lg border border-hair px-3 py-1 text-sm text-muted hover:bg-brand/5"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <label className="block text-sm">
                  <span className="text-muted">Allocation</span>
                  <select
                    value={fund}
                    onChange={(event) => setFund(event.target.value as DonationFund)}
                    className="mt-1 w-full rounded-lg border border-hair px-3 py-2"
                  >
                    {DONATION_FUNDS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="button"
                  onClick={start}
                  disabled={loading}
                  className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {loading
                    ? 'Starting…'
                    : frequency === 'monthly'
                      ? `Give $${amount} monthly`
                      : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
