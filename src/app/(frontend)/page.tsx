import Link from 'next/link'

import { DailyReadingsBanner } from '@/components/DailyReadingsBanner'
import { EventsList } from '@/components/EventsList'
import { KitchenOrdering } from '@/components/KitchenOrdering'
import { LiveStreamSection } from '@/components/LiveStreamSection'
import { PushNotificationToggle } from '@/components/PushNotificationToggle'
import {
  getKitchenSettings,
  getSiteSettings,
  getUpcomingEvents,
  getUrgentBulletin,
} from '@/lib/content'
import { getDailyReadings } from '@/lib/katameros'
import { getLiveStatus, getRecentVideos } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [site, kitchen, readings, events, urgent] = await Promise.all([
    getSiteSettings(),
    getKitchenSettings(),
    getDailyReadings(),
    getUpcomingEvents(4),
    getUrgentBulletin(),
  ])

  const live = await getLiveStatus(site.youtubeChannelIds)
  const videos = live.isLive ? [] : await getRecentVideos(site.youtubeChannelIds, 4)

  return (
    <div className="space-y-8">
      {urgent ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
            Urgent Announcement
          </p>
          <p className="mt-1 font-medium text-red-900">{urgent.title}</p>
          <Link href="/bulletins" className="mt-1 inline-block text-sm text-red-700 underline">
            Read more
          </Link>
        </div>
      ) : null}

      <section className="rounded-2xl bg-brand p-8 text-white">
        <p className="text-sm font-medium uppercase tracking-wide text-gold">{site.tagline}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{site.churchName}</h1>
        {site.address ? <p className="mt-2 text-slate-300">{site.address}</p> : null}
        {site.homeAnnouncement ? (
          <p className="mt-4 max-w-2xl text-slate-200">{site.homeAnnouncement}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/schedule"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand"
          >
            View Schedule
          </Link>
          <Link
            href="/kitchen"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Kitchen Order
          </Link>
          <Link
            href="/give"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Give
          </Link>
        </div>
      </section>

      <LiveStreamSection live={live} videos={videos} />

      <DailyReadingsBanner readings={readings} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Upcoming Services</h2>
          <Link href="/schedule" className="text-sm text-brand hover:underline">
            Full schedule
          </Link>
        </div>
        <EventsList events={events} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Kitchen Orders</h2>
          <Link href="/kitchen" className="text-sm text-brand hover:underline">
            Order page
          </Link>
        </div>
        <KitchenOrdering settings={kitchen} />
      </section>

      <PushNotificationToggle enabled={site.pushNotificationsEnabled} />
    </div>
  )
}
