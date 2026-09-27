import { NextResponse } from 'next/server'

import { isDonationFund, MAX_DONATION_AMOUNT, MIN_DONATION_AMOUNT } from '@/lib/donation-funds'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Online giving is not configured.' }, { status: 503 })
  }

  let body: { amountCents?: number; fund?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const amountCents = Number(body.amountCents)
  const min = MIN_DONATION_AMOUNT * 100
  const max = MAX_DONATION_AMOUNT * 100

  if (!Number.isInteger(amountCents) || amountCents < min || amountCents > max) {
    return NextResponse.json({ error: 'Invalid donation amount.' }, { status: 400 })
  }
  if (!isDonationFund(body.fund)) {
    return NextResponse.json({ error: 'Invalid allocation fund.' }, { status: 400 })
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || new URL(request.url).origin

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            recurring: { interval: 'month' },
            product_data: { name: `Monthly Donation - ${body.fund}` },
          },
        },
      ],
      success_url: `${serverUrl}/give?donation=success`,
      cancel_url: `${serverUrl}/give?donation=cancelled`,
      metadata: { fund: body.fund },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
