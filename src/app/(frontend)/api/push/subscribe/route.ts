import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  let subscription: {
    endpoint?: string
    keys?: { p256dh?: string; auth?: string }
  }

  try {
    subscription = (await request.json()) as typeof subscription
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { endpoint } = subscription
  const p256dh = subscription.keys?.p256dh
  const auth = subscription.keys?.auth

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'push-subscriptions',
      where: { endpoint: { equals: endpoint } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'push-subscriptions',
        data: {
          endpoint,
          keys: { p256dh, auth },
          userAgent: request.headers.get('user-agent') ?? undefined,
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Could not save subscription.' }, { status: 500 })
  }
}
