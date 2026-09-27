import type { GlobalConfig } from 'payload'

import { isAdminOrMedia } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site & Live Stream Settings',
  access: {
    read: () => true,
    update: isAdminOrMedia,
  },
  fields: [
    {
      name: 'churchName',
      type: 'text',
      defaultValue: 'St. Mark Coptic Orthodox Center',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'A home for worship, fellowship, and service.',
    },
    {
      type: 'row',
      fields: [
        { name: 'contactPhone', type: 'text', defaultValue: '(516) 458-4941' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'youtubeChannelIds',
      type: 'array',
      label: 'YouTube Channel Handles / IDs',
      labels: { singular: 'Channel', plural: 'Channels' },
      admin: {
        description:
          'Channel handles (e.g. @st.abraammedia) or channel IDs to poll for live streams. Falls back to the YOUTUBE_CHANNEL_IDS environment variable when empty.',
      },
      fields: [{ name: 'channelId', type: 'text', required: true }],
    },
    {
      name: 'pushNotificationsEnabled',
      type: 'checkbox',
      label: 'Enable Web Push Notifications',
      defaultValue: true,
    },
    {
      name: 'homeAnnouncement',
      type: 'textarea',
      label: 'Home Page Announcement',
    },
  ],
}
