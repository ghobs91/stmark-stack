import type { CollectionConfig } from 'payload'

import { isContentEditor } from '../access/roles'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'startTime', 'location'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endTime',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Divine Liturgy', value: 'liturgy' },
        { label: 'Vesper / Midnight Praises', value: 'vespers' },
        { label: 'Sunday School / Youth', value: 'youth' },
        { label: 'Bible Study', value: 'bible_study' },
        { label: 'Special Service', value: 'special' },
      ],
      required: true,
    },
    { name: 'description', type: 'textarea' },
    { name: 'location', type: 'text', defaultValue: 'Main Church Sanctuary' },
  ],
}
