import Link from 'next/link'

import { BulletinsList } from '@/components/BulletinsList'
import { DailyReadingsBanner } from '@/components/DailyReadingsBanner'
import { EventsList } from '@/components/EventsList'
import { HomeHero } from '@/components/HomeHero'
import { KitchenOrdering } from '@/components/KitchenOrdering'
import { LiveStreamSection } from '@/components/LiveStreamSection'
import { PushNotificationToggle } from '@/components/PushNotificationToggle'
import { SectionNav, type SectionNavItem } from '@/components/SectionNav'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  getKitchenSettings,
  getLatestBulletins,
  getSiteSettings,
  getUpcomingEvents,
  getUrgentBulletin,
} from '@/lib/content'
import { getDailyReadings } from '@/lib/katameros'
import { getLiveStatus, getRecentVideos } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

const SECTION_NAV: SectionNavItem[] = [
  { id: 'top', label: 'Welcome' },
  { id: 'today', label: "Today's Readings" },
  { id: 'live', label: 'Live & Sermons' },
  { id: 'services', label: 'Upcoming Services' },
  { id: 'news', label: 'News & Bulletins' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'give', label: 'Give' },
]

export default async function HomePage() {
  const [site, kitchen, readings, events, urgent, bulletins] = await Promise.all([
    getSiteSettings(),
    getKitchenSettings(),
    getDailyReadings(),
    getUpcomingEvents(4),
    getUrgentBulletin(),
    getLatestBulletins(3),
  ])

  const live = await getLiveStatus(site.youtubeChannelIds)
  const videos = live.isLive ? [] : await getRecentVideos(site.youtubeChannelIds, 4)

  return (
    <div>
      <SectionNav items={SECTION_NAV} />

      {urgent ? (
        <div className="border-b border-red-200 bg-red-50 dark:border-red-500/25 dark:bg-red-500/10">
          <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm">
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Urgent
            </span>
            <span className="font-medium text-red-900 dark:text-red-200">{urgent.title}</span>
            <Link href="/bulletins" className="text-red-700 underline dark:text-red-300">
              Read more
            </Link>
          </Container>
        </div>
      ) : null}

      <HomeHero
        churchName={site.churchName}
        tagline={site.tagline}
        address={site.address}
        announcement={site.homeAnnouncement}
      />

      <Section id="today" tone="parchment">
        <DailyReadingsBanner readings={readings} />
      </Section>

      <LiveStreamSection id="live" live={live} videos={videos} />

      <Section id="services" tone="white">
        <SectionHeading
          eyebrow="Upcoming Services"
          title="This week at St. Mark"
          action={
            <Link href="/schedule" className="text-sm font-medium text-gold transition hover:text-ink">
              Full schedule →
            </Link>
          }
        />
        <EventsList events={events} />
      </Section>

      <Section id="news" tone="parchment">
        <SectionHeading
          eyebrow="News & Bulletins"
          title="Latest from the parish"
          action={
            <Link href="/bulletins" className="text-sm font-medium text-gold transition hover:text-ink">
              All news →
            </Link>
          }
        />
        <BulletinsList bulletins={bulletins} />
      </Section>

      <Section id="kitchen" tone="warm">
        <SectionHeading eyebrow="Kitchen Service" title="Order for pickup" />
        <KitchenOrdering settings={kitchen} variant="teaser" />
      </Section>

      <Section tone="plain">
        <PushNotificationToggle enabled={site.pushNotificationsEnabled} />
      </Section>

      <Section id="give" tone="night">
        <div className="grid items-center gap-6 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">Building Towards Tomorrow</p>
            <h2 className="mt-1 text-2xl text-white sm:text-3xl">
              Support the ministry of St. Mark
            </h2>
            <p className="mt-2 text-sm text-subtle">
              Your generosity sustains our worship, building, and kitchen ministries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link
              href="/give"
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-gold-soft"
            >
              Give online
            </Link>
            <a
              href="sms:+15162465959?body=Build"
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Text &ldquo;Build&rdquo; to give
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
