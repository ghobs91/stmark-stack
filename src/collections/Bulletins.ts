import type { CollectionConfig } from 'payload'

import { isContentEditor } from '../access/roles'
import { notifyUrgentBulletin } from '../hooks/notifyUrgentBulletin'

export const Bulletins: CollectionConfig = {
  slug: 'bulletins',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'isUrgent'],
    group: 'Content',
  },
  hooks: {
    afterChange: [notifyUrgentBulletin],
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Weekly Bulletin', value: 'weekly' },
        { label: 'Condolences', value: 'condolence' },
        { label: 'General Announcement', value: 'announcement' },
        { label: 'Feast / Holy Week', value: 'feast' },
      ],
      defaultValue: 'weekly',
      required: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Post Body',
    },
    {
      name: 'pdfAttachment',
      type: 'upload',
      relationTo: 'media',
      label: 'Attach PDF Bulletin',
    },
    {
      name: 'isUrgent',
      type: 'checkbox',
      label: 'Mark as Urgent Announcement (Shows Banner)',
      defaultValue: false,
    },
  ],
}
