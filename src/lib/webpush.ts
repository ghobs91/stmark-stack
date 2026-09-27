export type PushSubscriptionPayload = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

type WebPushModule = typeof import('web-push')

let webPush: WebPushModule | null = null
let configured = false

async function getWebPush(): Promise<WebPushModule | null> {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return null

  if (!webPush) {
    const mod = await import('web-push')
    webPush = (mod.default ?? mod) as WebPushModule
  }
  if (!configured && webPush) {
    webPush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:info@saintmarkcenter.org',
      publicKey,
      privateKey,
    )
    configured = true
  }
  return webPush
}

export type PushNotification = {
  title: string
  body: string
  url?: string
}

/** Sends a single web-push notification. Returns false when push is unconfigured. */
export async function sendPushNotification(
  subscription: PushSubscriptionPayload,
  notification: PushNotification,
): Promise<boolean> {
  const client = await getWebPush()
  if (!client) return false

  try {
    await client.sendNotification(subscription, JSON.stringify(notification))
    return true
  } catch {
    return false
  }
}
