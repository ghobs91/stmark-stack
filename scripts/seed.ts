import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import type { Bulletin, Event } from '../src/payload-types'

const __dirname = dirname(fileURLToPath(import.meta.url))

type LegacyBulletin = {
  title: string
  category: string
  publishDate: string
  contentText: string
  sourceUrl: string
}

type LegacyEvent = {
  title: string
  startTime: string
  endTime: string
  eventType: string
  location: string
  description: string
}

type LegacyData = {
  source: string
  siteSettings: {
    churchName: string
    tagline: string
    contactPhone: string
    address: string
    youtubeChannelIds: string[]
    pushNotificationsEnabled: boolean
    homeAnnouncement: string
  }
  kitchenSettings: {
    isOrderingActive: boolean
    jotformId: string
    backupPhone: string
    announcement: string
  }
  bulletins: LegacyBulletin[]
  events: LegacyEvent[]
}

const lexicalParagraph = (text: string) =>
  ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: text
        ? [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [
                {
                  type: 'text',
                  text,
                  format: 0,
                  style: '',
                  mode: 'normal',
                  detail: 0,
                  version: 1,
                },
              ],
            },
          ]
        : [],
    },
  }) as unknown as Bulletin['content']

/** Convert a wall-clock time in a zone to a UTC instant. */
const zonedToUtc = (y: number, mo: number, d: number, h: number, mi: number, tz: string) => {
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0)
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = dtf.formatToParts(new Date(guess))
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return new Date(guess - (asUTC - guess))
}

/**
 * Optional: generate the church's advertised weekly liturgies (Saturday Arabic,
 * Sunday English, Wednesday) for the next 8 weeks. Enable with SEED_SAMPLE_UPCOMING=1.
 */
const sampleUpcomingEvents = () => {
  const tz = 'America/New_York'
  const out: LegacyEvent[] = []
  const now = new Date()
  const days = ['Saturday Arabic Liturgy', 'Sunday English Liturgy', 'Wednesday Liturgy']
  for (let week = 0; week < 8; week += 1) {
    for (const title of days) {
      const targetDow = title.startsWith('Saturday') ? 6 : title.startsWith('Sunday') ? 0 : 3
      const base = new Date(now)
      base.setDate(now.getDate() + ((targetDow - now.getDay() + 7) % 7) + week * 7)
      const start = zonedToUtc(
        base.getFullYear(),
        base.getMonth() + 1,
        base.getDate(),
        9,
        0,
        tz,
      )
      if (start.getTime() < now.getTime()) continue
      out.push({
        title,
        startTime: start.toISOString(),
        endTime: new Date(start.getTime() + 2 * 3600_000).toISOString(),
        eventType: 'liturgy',
        location: 'Main Church Sanctuary',
        description: '',
      })
    }
  }
  return out
}

const run = async () => {
  const data = JSON.parse(
    readFileSync(resolve(__dirname, 'seed/legacy-content.json'), 'utf8'),
  ) as LegacyData

  const payload = await getPayload({ config })
  payload.logger.info(`Seeding legacy content from ${data.source}`)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...data.siteSettings,
      youtubeChannelIds: data.siteSettings.youtubeChannelIds.map((channelId) => ({ channelId })),
    },
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'kitchen-settings',
    data: data.kitchenSettings,
    overrideAccess: true,
  })
  payload.logger.info('Updated site-settings and kitchen-settings globals')

  const existingBulletins = await payload.find({
    collection: 'bulletins',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })
  const bulletinTitles = new Set(existingBulletins.docs.map((doc) => doc.title))

  let bulletinsCreated = 0
  for (const bulletin of data.bulletins) {
    if (bulletinTitles.has(bulletin.title)) continue
    await payload.create({
      collection: 'bulletins',
      data: {
        title: bulletin.title,
        category: bulletin.category as Bulletin['category'],
        publishDate: bulletin.publishDate,
        content: lexicalParagraph(bulletin.contentText),
        isUrgent: false,
      },
      overrideAccess: true,
    })
    bulletinsCreated += 1
  }
  payload.logger.info(`Bulletins created: ${bulletinsCreated} (of ${data.bulletins.length})`)

  const allEvents: LegacyEvent[] = process.env.SEED_SAMPLE_UPCOMING
    ? [...data.events, ...sampleUpcomingEvents()]
    : data.events

  const existingEvents = await payload.find({
    collection: 'events',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })
  const eventKeys = new Set(
    existingEvents.docs.map((doc) => `${doc.title}|${new Date(doc.startTime).toISOString()}`),
  )

  let eventsCreated = 0
  for (const event of allEvents) {
    const key = `${event.title}|${new Date(event.startTime).toISOString()}`
    if (eventKeys.has(key)) continue
    await payload.create({
      collection: 'events',
      data: {
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        eventType: event.eventType as Event['eventType'],
        location: event.location || 'Main Church Sanctuary',
        description: event.description || undefined,
      },
      overrideAccess: true,
    })
    eventKeys.add(key)
    eventsCreated += 1
  }
  payload.logger.info(`Events created: ${eventsCreated} (of ${allEvents.length})`)
  payload.logger.info('Seed complete')
}

await run()
process.exit(0)
