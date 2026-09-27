import type { CollectionConfig } from 'payload'

import { isContentEditor } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
