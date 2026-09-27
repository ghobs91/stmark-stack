import { getPayloadClient } from './payload'

export type SiteSettingsData = {
  churchName: string
  tagline: string
  contactPhone: string
  address: string
  youtubeChannelIds: string[]
  pushNotificationsEnabled: boolean
  homeAnnouncement: string
}

export type KitchenSettingsData = {
  isOrderingActive: boolean
  jotformId: string
  backupPhone: string
  announcement: string
}

export type EventData = {
  id: number | string
  title: string
  startTime: string
  endTime: string
  eventType: string
  description: string | null
  location: string | null
}

export type BulletinData = {
  id: number | string
  title: string
  category: string
  publishDate: string
  isUrgent: boolean
  content: unknown
  pdfUrl: string | null
}

const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  churchName: 'St. Mark Coptic Orthodox Center',
  tagline: 'A home for worship, fellowship, and service.',
  contactPhone: '(516) 458-4941',
  address: '',
  youtubeChannelIds: [],
  pushNotificationsEnabled: true,
  homeAnnouncement: '',
}

const DEFAULT_KITCHEN_SETTINGS: KitchenSettingsData = {
  isOrderingActive: true,
  jotformId: '201970498209159',
  backupPhone: '(516) 458-4941',
  announcement: 'Pickup available Saturdays and Sundays after liturgy.',
}

const envChannels = () =>
  (process.env.YOUTUBE_CHANNEL_IDS || '')
    .split(',')
    .map((channel) => channel.trim())
    .filter(Boolean)

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const channels = (settings.youtubeChannelIds ?? [])
      .map((entry) => entry?.channelId)
      .filter((channel): channel is string => Boolean(channel))

    return {
      churchName: settings.churchName || DEFAULT_SITE_SETTINGS.churchName,
      tagline: settings.tagline || DEFAULT_SITE_SETTINGS.tagline,
      contactPhone: settings.contactPhone || DEFAULT_SITE_SETTINGS.contactPhone,
      address: settings.address || DEFAULT_SITE_SETTINGS.address,
      youtubeChannelIds: channels.length > 0 ? channels : envChannels(),
      pushNotificationsEnabled: settings.pushNotificationsEnabled ?? true,
      homeAnnouncement: settings.homeAnnouncement || '',
    }
  } catch {
    return { ...DEFAULT_SITE_SETTINGS, youtubeChannelIds: envChannels() }
  }
}

export async function getKitchenSettings(): Promise<KitchenSettingsData> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'kitchen-settings', depth: 0 })
    return {
      isOrderingActive: settings.isOrderingActive ?? true,
      jotformId: settings.jotformId || DEFAULT_KITCHEN_SETTINGS.jotformId,
      backupPhone: settings.backupPhone || DEFAULT_KITCHEN_SETTINGS.backupPhone,
      announcement: settings.announcement || DEFAULT_KITCHEN_SETTINGS.announcement,
    }
  } catch {
    return DEFAULT_KITCHEN_SETTINGS
  }
}

export async function getUpcomingEvents(limit = 25): Promise<EventData[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: { endTime: { greater_than_equal: new Date().toISOString() } },
      sort: 'startTime',
      limit,
      depth: 0,
    })
    return result.docs.map((event) => ({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      eventType: event.eventType,
      description: event.description ?? null,
      location: event.location ?? null,
    }))
  } catch {
    return []
  }
}

export async function getAllUpcomingEvents(): Promise<EventData[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: { endTime: { greater_than_equal: new Date().toISOString() } },
      sort: 'startTime',
      limit: 500,
      depth: 0,
    })
    return result.docs.map((event) => ({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      eventType: event.eventType,
      description: event.description ?? null,
      location: event.location ?? null,
    }))
  } catch {
    return []
  }
}

const toBulletin = (doc: {
  id: number | string
  title: string
  category: string
  publishDate: string
  isUrgent?: boolean | null
  content?: unknown
  pdfAttachment?: unknown
}): BulletinData => {
  let pdfUrl: string | null = null
  const attachment = doc.pdfAttachment
  if (attachment && typeof attachment === 'object' && 'url' in attachment) {
    pdfUrl = (attachment as { url?: string | null }).url ?? null
  }

  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    publishDate: doc.publishDate,
    isUrgent: Boolean(doc.isUrgent),
    content: doc.content ?? null,
    pdfUrl,
  }
}

export async function getLatestBulletins(limit = 20): Promise<BulletinData[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'bulletins',
      sort: '-publishDate',
      limit,
      depth: 1,
    })
    return result.docs.map(toBulletin)
  } catch {
    return []
  }
}

export async function getUrgentBulletin(): Promise<BulletinData | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'bulletins',
      where: { isUrgent: { equals: true } },
      sort: '-publishDate',
      limit: 1,
      depth: 1,
    })
    return result.docs[0] ? toBulletin(result.docs[0]) : null
  } catch {
    return null
  }
}

export async function getBulletinById(id: string): Promise<BulletinData | null> {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({ collection: 'bulletins', id, depth: 1 })
    return doc ? toBulletin(doc) : null
  } catch {
    return null
  }
}

export const BULLETIN_CATEGORY_LABELS: Record<string, string> = {
  weekly: 'Weekly Bulletin',
  condolence: 'Condolences',
  announcement: 'General Announcement',
  feast: 'Feast / Holy Week',
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  liturgy: 'Divine Liturgy',
  vespers: 'Vesper / Midnight Praises',
  youth: 'Sunday School / Youth',
  bible_study: 'Bible Study',
  special: 'Special Service',
}
