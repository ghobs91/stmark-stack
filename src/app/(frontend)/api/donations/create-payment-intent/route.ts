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

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { fund: body.fund },
      description: `Donation - ${body.fund}`,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch {
    return NextResponse.json({ error: 'Could not create payment.' }, { status: 500 })
  }
}
