import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/roles'

export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  admin: {
    useAsTitle: 'endpoint',
    group: 'Administration',
    description: 'Web Push subscriptions captured from installed PWA clients.',
  },
  access: {
    // Subscriptions are only ever created/removed by trusted server routes
    // using Payload's local API with `overrideAccess: true`.
    read: isAdmin,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'keys',
      type: 'group',
      fields: [
        { name: 'p256dh', type: 'text', required: true },
        { name: 'auth', type: 'text', required: true },
      ],
    },
    {
      name: 'userAgent',
      type: 'text',
    },
  ],
}
