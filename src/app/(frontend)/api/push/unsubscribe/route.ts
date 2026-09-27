import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  let body: { endpoint?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!body.endpoint) {
    return NextResponse.json({ error: 'Missing endpoint.' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: 'push-subscriptions',
      where: { endpoint: { equals: body.endpoint } },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Could not remove subscription.' }, { status: 500 })
  }
}
