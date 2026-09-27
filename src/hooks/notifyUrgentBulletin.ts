import type { CollectionAfterChangeHook } from 'payload'

import { sendPushNotification } from '../lib/webpush'

/**
 * Sends a web-push alert to every stored subscription when a bulletin is
 * marked urgent (either on create, or when the flag flips on update).
 * Failures are swallowed so publishing never breaks on push errors.
 */
export const notifyUrgentBulletin: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const becameUrgent = Boolean(doc?.isUrgent) && (operation === 'create' || !previousDoc?.isUrgent)
  if (!becameUrgent) return doc

  try {
    const subscriptions = await req.payload.find({
      collection: 'push-subscriptions',
      limit: 0,
      pagination: false,
      overrideAccess: true,
    })

    await Promise.all(
      subscriptions.docs.map((subscription) =>
        sendPushNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },
          {
            title: 'St. Mark Announcement',
            body: doc.title,
            url: '/bulletins',
          },
        ),
      ),
    )
  } catch {
    // Push delivery is best-effort.
  }

  return doc
}
